import {
  Component,
  ViewEncapsulation,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { BookingService } from 'src/app/services/booking.service';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { QRCodeService } from 'src/app/services/qrcode.service';
import { QrdialogComponent } from 'src/app/qrdialog/qrdialog.component';

interface Meal {
  userId: string;
  mealType: string;
  date: string | null;
  isCancelled: boolean;
}

interface Booking {
  bookingId: string;
  mealType: string;
  isCancelled: boolean;
  qrButtonDisabled?: boolean; // This property is optional since it's added dynamically
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public mealData: Meal[] = [];
  public lunchMenu: string[] = [];
  public dinnerMenu: string[] = [];
  //public mealMessage: string = '';
  public selectedDate: Date | null = new Date();
  public todayDate: Date = new Date();
  public mealType: string = '';
  public mealTaken: string = '';

  public weekMenus: { [key: string]: { lunch: string[]; dinner: string[] } } = {
    Monday: {
      lunch: [
        'Aloo Gobi',
        'Paneer Butter Masala',
        'Roti',
        'Dal Tadka',
        'Rice',
        'Papad',
      ],
      dinner: ['Tomato Soup', 'Vegetable Pulao', 'Salad'],
    },
    Tuesday: {
      lunch: ['Bhindi Masala', 'Chole', 'Roti', 'Rajma', 'Rice', 'Papad'],
      dinner: ['Sweet Corn Soup', 'Jeera Rice', 'Salad'],
    },
    Wednesday: {
      lunch: [
        'Kadai Paneer',
        'Aloo Palak',
        'Roti',
        'Moong Dal',
        'Rice',
        'Papad',
      ],
      dinner: ['Lemon Coriander Soup', 'Veg Biryani', 'Salad'],
    },
    Thursday: {
      lunch: [
        'Baingan Bharta',
        'Matar Paneer',
        'Roti',
        'Toor Dal',
        'Rice',
        'Papad',
      ],
      dinner: ['Hot and Sour Soup', 'Curd Rice', 'Salad'],
    },
    Friday: {
      lunch: [
        'Mix Veg Curry',
        'Dal Makhani',
        'Roti',
        'Chana Dal',
        'Rice',
        'Papad',
      ],
      dinner: ['Manchow Soup', 'Peas Pulao', 'Salad'],
    },
    // },
    // 'Saturday': {
    //   lunch: [],
    //   dinner: []
    // },
    // 'Sunday': {
    //   lunch: [],
    //   dinner: []
    // }
  };

  feedbackFormGroup!: FormGroup;
  bookingFormGroup!: FormGroup;
  cancelBookingFormGroup!: FormGroup;
  quickBookingFormGroup!: FormGroup;

  todaysBooking: any = [];
  public bookings: any[] = [];
  public filteredBookingsList: any[] = [];
  displayedColumns: string[] = ['date', 'mealType'];
  public bookingListFormGroup!: FormGroup;
  public filteredBookings: Meal[] = [];
  public months = [
    { value: 0, viewValue: 'January' },
    { value: 1, viewValue: 'February' },
    { value: 2, viewValue: 'March' },
    { value: 3, viewValue: 'April' },
    { value: 4, viewValue: 'May' },
    { value: 5, viewValue: 'June' },
    { value: 6, viewValue: 'July' },
    { value: 7, viewValue: 'August' },
    { value: 8, viewValue: 'September' },
    { value: 9, viewValue: 'October' },
    { value: 10, viewValue: 'November' },
    { value: 11, viewValue: 'December' },
  ];

  public years: number[] = [];

  @ViewChild('feedbackForm') feedbackFormTemplate!: TemplateRef<any>;
  @ViewChild('bookingForm') bookingFormTemplate!: TemplateRef<any>;
  @ViewChild('cancelBookingForm') cancelBookingFormTemplate!: TemplateRef<any>;
  @ViewChild('bookingList') bookingListTemplate!: TemplateRef<any>;
  @ViewChild('quickBookingForm') quickBookingTemplate!: TemplateRef<any>;
  @ViewChild('selectedDateTemplate') selectedDateTemplate!: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private qRCodeService: QRCodeService,
    private toast: NgToastService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private cdr:ChangeDetectorRef
  ) {
    this.feedbackFormGroup = this.fb.group({
      message: [''],
    });

    this.bookingFormGroup = this.fb.group({
      mealType: ['lunch', Validators.required],
      dateRange: this.fb.group({
        start: [null, Validators.required],
        end: [null, Validators.required],
      }),
    });

    this.cancelBookingFormGroup = this.fb.group({
      mealType: ['lunch', Validators.required],
    });

    this.quickBookingFormGroup = this.fb.group({
      bookingDate: [this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')],
      mealType: ['lunch', Validators.required],
    });

    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit(): void {
    this.getBookings();

    this.bookingListFormGroup = this.fb.group({
      month: [null],
      year: [null],
      mealType: [null],
    });

    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear + 1, currentYear + 2];
    this.updateMenu('init');

    //this.checkShowQRButton()
 
  }

  updateMenu(from: any) {
    if (from !== 'init') {
      this.onSelectedDate();
    }
    const dayOfWeek = this.selectedDate
      ? this.selectedDate.toLocaleString('en-us', { weekday: 'long' })
      : '';

    // if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
    //   this.mealMessage = 'Meal facility is closed';
    //   this.lunchMenu = [];
    //   this.dinnerMenu = [];
    // } else {
    //this.mealMessage = '';
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
      return;
    }
    this.lunchMenu = this.weekMenus[dayOfWeek].lunch;
    this.dinnerMenu = this.weekMenus[dayOfWeek].dinner;
    //}
  }

  setMealType() {
    const hours = new Date().getHours();
    this.mealType = hours < 16 ? 'Lunch' : 'Dinner';
    const todayString = this.todayDate.toISOString().split('T')[0];
    const todayMeal = this.mealData.find((meal) => meal.date === todayString);
    this.mealTaken = todayMeal
      ? `Meal taken: ${todayMeal.mealType}`
      : 'No meal taken today';
  }

  onSelectedDate() {
    this.dialog.open(this.selectedDateTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur',
    });
  }

  openQuickBookingForm() {
    this.dialog.open(this.quickBookingTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur',
    });
  }

  closeQuickBooking() {
    this.quickBookingFormGroup.reset();
    this.dialog.closeAll();
  }

  submitQuickBooking() {
    if (this.quickBookingFormGroup.valid) {
      const bookingDate = this.datePipe.transform(
        this.selectedDate,
        'yyyy-MM-dd'
      );
      const mealType = this.quickBookingFormGroup.value.mealType;

      if (bookingDate) {
        const requestData = {
          date: bookingDate,
          mealType,
        };

        this.bookingService.quickBooking(requestData).subscribe({
          next: () => {
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Booking successful!',
              duration: 3000,
            });
            this.quickBookingFormGroup.reset({
              bookingDate: this.datePipe.transform(
                this.selectedDate,
                'yyyy-MM-dd'
              ),
              mealType: 'lunch',
            });
            this.dialog.closeAll();
          },
          error: (err) => {
            this.toast.error({
              detail: 'ERROR',
              summary: err.message,
              duration: 3000,
            });
          },
        });
      }
    }
  }

  openCancelBookingForm() {
    this.dialog.open(this.cancelBookingFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur',
    });
  }

  closeCancelBooking() {
    this.cancelBookingFormGroup.reset();
    this.dialog.closeAll();
    this.selectedDate=null;
  }

  submitCancelBooking() {
    if (this.cancelBookingFormGroup.valid) {
      const bookingDate = this.datePipe.transform(
        this.selectedDate,
        'yyyy-MM-dd'
      );
      const mealType = this.cancelBookingFormGroup.value.mealType;

      if (bookingDate) {
        this.bookingService.cancelBooking(bookingDate, mealType).subscribe({
          next: () => {
            this.toast.success({
              detail: 'SUCCESS',
              summary: 'Booking cancelled successfully!',
              duration: 3000,
            });
            this.cancelBookingFormGroup.reset();
            this.dialog.closeAll();
          },
          error: (err) => {
            this.toast.error({
              detail: 'ERROR',
              summary: err.message,
              duration: 3000,
            });
          },
        });
      }
    }
  }

  openFeedbackForm() {
    this.dialog.open(this.feedbackFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur',
    });
  }

  openBookingForm() {
    this.dialog.open(this.bookingFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur',
    });
  }
  closeBooking() {
    this.bookingFormGroup.reset({
      mealType: 'lunch', // Reset to default value 'lunch'
      dateRange: {
        start: null,
        end: null,
      },
    });
    this.dialog.closeAll();
  }

  openBookingList() {
    this.dialog.open(this.bookingListTemplate, {
      width: '800px',
      backdropClass: 'backdrop-blur',
    });
  }

  submitFeedback() {
    if (this.feedbackFormGroup.valid) {
      console.log(this.feedbackFormGroup.value);
      // Handle the form submission
      this.bookingService.addFeedback(this.feedbackFormGroup.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Thanks for sharing your valuable Feedback',
            duration: 3000,
          });
          this.feedbackFormGroup.reset();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.log(err.message);
          this.toast.error({
            detail: 'Error Occured',
            summary: 'Failed to submit feedback!',
            duration: 3000,
          });
        },
      });
    }
  }

  submitBooking() {
    if (this.bookingFormGroup.valid) {
      console.log(this.bookingFormGroup.value);

      const startDate = this.bookingFormGroup.value.dateRange.start;
      const endDate = this.bookingFormGroup.value.dateRange.end;

      // Ensure dates are set to midnight
      // const adjustedStartDate = new Date(startDate);
      // adjustedStartDate.setHours(0, 0, 0, 0);

      // const adjustedEndDate = new Date(endDate);
      // adjustedEndDate.setHours(0, 0, 0, 0);

      const booking = {
        mealType: this.bookingFormGroup.value.mealType,
        //startDate:new Date(adjustedStartDate.getFullYear() + '-'+ (adjustedStartDate.getMonth()+1) + '-'+adjustedStartDate.getDate()) ,
        //endDate: new Date(adjustedEndDate.getFullYear() + '-'+ (adjustedEndDate.getMonth()+1) + '-'+adjustedEndDate.getDate()), // Format to 'YYYY-MM-DD'
        startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd'),
      };
      // Handle the form submission
      this.bookingService.createBooking(booking).subscribe({
        next: (res) => {
          console.log(res);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Booking added Successfully!',
            duration: 3000,
          });
          this.bookingFormGroup.reset();
          this.dialog.closeAll();
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }

 

  filterBookings() {
    if (this.bookingListFormGroup.valid) {
      const { month, year, mealType } = this.bookingListFormGroup.value;
      console.log('Form Values:', { month, year, mealType });

      console.log(this.filteredBookings);

      this.filteredBookingsList = this.bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();
        const bookingMealType = booking.mealType;

        const matchesMonth = month !== null ? bookingMonth === month : true;
        const matchesYear = year !== null ? bookingYear === year : true;
        const matchesMealType = mealType ? bookingMealType === mealType : true;

        return matchesMonth && matchesYear && matchesMealType && !booking.isCancelled;
      });

      this.filteredBookingsList.map((booking) =>{
        booking.date=booking.bookingDate
      })
        // Sort mealData by date from January to December
        this.filteredBookingsList.sort((a, b) => {
          const dateAString = this.datePipe.transform(a.date, 'yyyy-MM-dd');
          const dateBString = this.datePipe.transform(b.date, 'yyyy-MM-dd');
  
          // Ensure dates are not null before parsing
          const dateA = dateAString
            ? new Date(dateAString.replace(/-/g, '/'))
            : new Date();
          const dateB = dateBString
            ? new Date(dateBString.replace(/-/g, '/'))
            : new Date();
  
          return dateA.getTime() - dateB.getTime();
        });
      console.log('Filtered Bookings:', this.filteredBookingsList);
    } else {
      console.log('Form is invalid');
    }
  }

  // getCoupon(){
  //   console.log(this.todaysBooking)
  //   this.qRCodeService.getQrCodeByBookingId(this.todaysBooking[0].bookingId).subscribe(res =>{
  //     console.log(res);

  //     const dialogRef = this.dialog.open(QrdialogComponent, {
  //       data: res,
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed');
  //     });

  //   })
  // }

  showQRButton: boolean = false;

  checkShowQRButton() {
    //const currentTime = new Date();
    const currentTime = new Date('2024-07-08T13:00:00'); // Set the date you want to test
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const lunchStartTime = 11 * 60 + 30; // 11:30 AM
    const lunchEndTime = 14 * 60; // 2:00 PM
    const dinnerStartTime = 18 * 60 + 30; // 6:30 PM
    const dinnerEndTime = 21 * 60; // 9:00 PM

    const checkTime =
      (currentTimeInMinutes >= lunchStartTime &&
        currentTimeInMinutes <= lunchEndTime) ||
      (currentTimeInMinutes >= dinnerStartTime &&
        currentTimeInMinutes <= dinnerEndTime);
    
        let selectedBookingId: string | null = null;

        console.log("Todays Bookings:",this.todaysBooking.length)
    
        if (
          currentTimeInMinutes >= lunchStartTime &&
          currentTimeInMinutes <= lunchEndTime
        ) {
          const lunchBooking = this.todaysBooking.find(
            (booking: Booking) =>
              booking.mealType === 'lunch' && !booking.isCancelled
          );
          if (lunchBooking) {
            selectedBookingId = lunchBooking.bookingId;
          }
        } else if (
          currentTimeInMinutes >= dinnerStartTime &&
          currentTimeInMinutes <= dinnerEndTime
        ) {
          const dinnerBooking = this.todaysBooking.find(
            (booking: Booking) =>
              booking.mealType === 'dinner' && !booking.isCancelled
          );
          if (dinnerBooking) {
            selectedBookingId = dinnerBooking.bookingId;
          }
        }
        console.log("hello",selectedBookingId);

        if(selectedBookingId){
          this.qRCodeService
          .getQrCodeByBookingId(selectedBookingId)
          .subscribe((res) => {
            console.log("selected booking COupon",res);
            this.showQRButton = checkTime && !res.isRedeemed
           });
          }   
  }

  // getCoupon() {
  //   console.log(this.todaysBooking);
  //    //const currentTime = new Date();
  //   const currentTime = new Date("2024-06-18")
  //   console.log(currentTime)
  //   const currentHour = currentTime.getHours();
  //   const currentMinute = currentTime.getMinutes();
  //   const currentTimeInMinutes = currentHour * 60 + currentMinute;

  //   // Define time ranges in minutes
  //   const lunchStartTime = 11 * 60 + 30; // 11:30 AM
  //   const lunchEndTime = 14 * 60; // 2:00 PM
  //   const dinnerStartTime = 18 * 60 + 30; // 6:30 PM
  //   const dinnerEndTime = 21 * 60; // 9:00 PM

  //   let selectedBookingId: string | null = null;

  //   if (
  //     currentTimeInMinutes >= lunchStartTime &&
  //     currentTimeInMinutes <= lunchEndTime
  //   ) {
  //     const lunchBooking = this.todaysBooking.find(
  //       (booking: Booking) => booking.mealType === 'lunch' && !booking.isCancelled
  //     );
  //     if (lunchBooking) {
  //       selectedBookingId = lunchBooking.bookingId;
  //     }
  //   } else if (
  //     currentTimeInMinutes >= dinnerStartTime &&
  //     currentTimeInMinutes <= dinnerEndTime
  //   ) {
  //     const dinnerBooking = this.todaysBooking.find(
  //       (booking: Booking) => booking.mealType === 'dinner' && !booking.isCancelled
  //     );
  //     if (dinnerBooking) {
  //       selectedBookingId = dinnerBooking.bookingId;
  //     }
  //   }

  //   if (selectedBookingId) {
  //     console.log("isredemeed called!!");
  //     this.qRCodeService
  //       .getQrCodeByBookingId(selectedBookingId)
  //       .subscribe((res) => {
  //         console.log(res);

  //         // Redeem the coupon
  //       this.qRCodeService.redeemCoupon(res.couponId).subscribe((redeemSuccess: boolean) => {
  //         if (redeemSuccess) {
  //           console.log('Coupon redeemed successfully');
  //           const dialogRef = this.dialog.open(QrdialogComponent, {
  //             data: res,
  //           });

  //           dialogRef.afterClosed().subscribe(() => {
  //             console.log('The dialog was closed');
  //             // Disable QR button after 15 minutes
  //             setTimeout(() => {
  //               // Logic to disable the QR button
  //               this.disableQrButton(selectedBookingId!);
  //             }, 15 * 60 * 1000);
  //           });
  //         } else {
  //           console.log('Failed to redeem the coupon');
  //         }});

  //         // const dialogRef = this.dialog.open(QrdialogComponent, {
  //         //   data: res,
  //         // });

  //         // dialogRef.afterClosed().subscribe((result) => {
  //         //   console.log('The dialog was closed');
  //         // });
  //       });
  //   } else {
  //     console.log('No valid booking found for the current time.');
  //   }
  // }

  getBookings(): void {
    this.bookingService.getBookingsByUserId().subscribe((data) => {
      this.bookings = data;

      this.mealData = data.filter((booking) => !booking.isCancelled).map((booking) => ({
        userId: booking.userId,
        mealType: booking.mealType,
        //date: new Date(booking.bookingDate).toISOString().split('T')[0],
        date: this.datePipe.transform(booking.bookingDate, 'yyyy-MM-dd'),
        isCancelled: booking.isCancelled,
      }));
      // console.log(this.mealData[0].isCancelled);

      // Sort mealData by date from January to December
      this.mealData.sort((a, b) => {
        const dateAString = this.datePipe.transform(a.date, 'yyyy-MM-dd');
        const dateBString = this.datePipe.transform(b.date, 'yyyy-MM-dd');

        // Ensure dates are not null before parsing
        const dateA = dateAString
          ? new Date(dateAString.replace(/-/g, '/'))
          : new Date();
        const dateB = dateBString
          ? new Date(dateBString.replace(/-/g, '/'))
          : new Date();

        return dateA.getTime() - dateB.getTime();
      });
      //console.log(this.mealData)

      this.filteredBookingsList = this.mealData; // Initially, show all bookings

      this.updateMenu('init'); // Update the menu once bookings are fetched
      this.setMealType();
      // Sort mealData by date from January to December
      this.filteredBookingsList.sort((a, b) => {
        const dateAString = this.datePipe.transform(
          a.bookingDate,
          'yyyy-MM-dd'
        );
        const dateBString = this.datePipe.transform(
          b.bookingDate,
          'yyyy-MM-dd'
        );

        // Ensure dates are not null before parsing
        const dateA = dateAString
          ? new Date(dateAString.replace(/-/g, '/'))
          : new Date();
        const dateB = dateBString
          ? new Date(dateBString.replace(/-/g, '/'))
          : new Date();

        return dateA.getTime() - dateB.getTime();
      });

      console.log(this.filteredBookingsList);

      const newDate = new Date('2024-07-08'); // Set the date you want to test
      //const newDate = new Date(); // Set the date you want to test

      this.bookings.forEach((element) => {
        const checkDate = this.datePipe.transform(
          element.bookingDate,
          'yyyy-MM-dd'
        );

        if (checkDate === this.datePipe.transform(newDate, 'yyyy-MM-dd')) {
          // Assuming todaysBooking is an array
          this.todaysBooking.push(element);
        }
      });

      console.log('Todays Booking:', this.todaysBooking);

      this.checkShowQRButton();
    });
  }
  

  getCoupon() {
    console.log('Todays Booking:', this.todaysBooking);
    //const currentTime = new Date();
    const currentTime = new Date('2024-07-08T13:00:00'); // Set the current time for testing
    console.log('Current Time:', currentTime);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Define time ranges in minutes
    const lunchStartTime = 11 * 60 + 30; // 11:30 AM
    const lunchEndTime = 14 * 60; // 2:00 PM
    const dinnerStartTime = 18 * 60 + 30; // 6:30 PM
    const dinnerEndTime = 21 * 60; // 9:00 PM

    let selectedBookingId: string | null = null;

    if (
      currentTimeInMinutes >= lunchStartTime &&
      currentTimeInMinutes <= lunchEndTime
    ) {
      const lunchBooking = this.todaysBooking.find(
        (booking: Booking) =>
          booking.mealType === 'lunch' && !booking.isCancelled
      );
      if (lunchBooking) {
        selectedBookingId = lunchBooking.bookingId;
      }
    } else if (
      currentTimeInMinutes >= dinnerStartTime &&
      currentTimeInMinutes <= dinnerEndTime
    ) {
      const dinnerBooking = this.todaysBooking.find(
        (booking: Booking) =>
          booking.mealType === 'dinner' && !booking.isCancelled
      );
      if (dinnerBooking) {
        selectedBookingId = dinnerBooking.bookingId;
      }
    }
    console.log(selectedBookingId);

    if (selectedBookingId) {
      console.log('isredemeed called!!');
      this.qRCodeService
        .getQrCodeByBookingId(selectedBookingId)
        .subscribe((res) => {
          console.log(res);
          const dialogRef = this.dialog.open(QrdialogComponent, {
            data: res,
          });

          dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
          this.showQRButton=false
          });

          //Redeem the coupon
          console.log(res.couponId);
          this.qRCodeService.redeemCoupon(res.couponId).subscribe((redeemSuccess:any) => {
            console.log(redeemSuccess)
            if (redeemSuccess.success === true) {
              console.log('Coupon redeemed successfully');
              this.toast.success({detail:"SUCCESS",summary:redeemSuccess.message,duration:3000})

            } else {
              console.log('Failed to redeem the coupon');
              this.toast.error({detail:"ERROR",summary:redeemSuccess.message,duration:3000})

            }
          });
        });
    } else {
      console.log('No valid booking found for the current time.');
    }
  }

  // disableQrButton(bookingId: string) {
  //   const booking = this.todaysBooking.find(
  //     (b: Booking) => b.bookingId === bookingId
  //   );
  //   if (booking) {
  //     booking.qrButtonDisabled = true;
  //     this.showQRButton=false;
  //   }
  // }

  resetFilter() {
    this.filteredBookingsList = this.bookings;
    this.bookingListFormGroup.reset();
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    //console.log(this.mealData);
    console.log("Cell DAte",cellDate)
    if (cellDate && view === 'month') {
      const cellDateString = this.datePipe.transform(cellDate, 'yyyy-MM-dd');

      const hasBooking = this.mealData.find(
        (booking) => booking.date === cellDateString && !booking.isCancelled
      );
      console.log(hasBooking)
      if (hasBooking) {
        return 'custom-calendar-cell highlight-date';
      } else {
        return 'custom-calendar-cell';
      }
    }
    return 'custom-calendar-cell';
  };

  dateFilter = (date: Date | null): boolean => {
    if (date) {
      const day = date.getDay();
      return day !== 0 && day !== 6; // Disable Saturdays (6) and Sundays (0)
    }
    return true;
  };

  setStars(event: MouseEvent) {
    const starElement = event.target as HTMLElement;
    const stars = starElement.parentElement?.children;
    const starIndex = Array.prototype.indexOf.call(stars, starElement);

    if (stars) {
      for (let i = 0; i <= starIndex; i++) {
        const star = stars[i] as HTMLElement;
        star.innerText = 'star'; // Fill the star
        star.style.color = '#fdd835'; // Yellow color for filled stars
      }
      for (let i = starIndex + 1; i < stars.length; i++) {
        const star = stars[i] as HTMLElement;
        star.innerText = 'star_border'; // Unfill the star
        star.style.color = ''; // Reset color for unfilled stars
      }
      // Set the value of 'stars' in the form group
      this.feedbackFormGroup.controls['stars'].setValue(starIndex + 1);
    }
  }

  isLunchTime(): boolean {
    const hours = new Date().getHours();
    const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    return hours >= 12 && hours < 14 && dayOfWeek !== 0 && dayOfWeek !== 6; // Lunchtime: 12 PM to 2 PM, excluding Saturday and Sunday
  }

  isDinnerTime(): boolean {
    const hours = new Date().getHours();
    const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    return hours >= 19 && hours < 21 && dayOfWeek !== 0 && dayOfWeek !== 6; // Dinner time: 7 PM to 9 PM, excluding Saturday and Sunday
  }

  isDisabled(): boolean {
    return !this.isLunchTime() && !this.isDinnerTime();
  }

  
}
