import {
  Component,
  ViewEncapsulation,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { BookingService } from 'src/app/services/booking.service';
import { DateAdapter } from '@angular/material/core';
import{DatePipe} from '@angular/common';

interface Meal {
  userId: string;
  mealType: string;
  date: string | null;
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


  public bookings: any[] = [];
  public filteredBookingsList: any[] = [];
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

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toast: NgToastService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe:DatePipe
  ) {
    this.feedbackFormGroup = this.fb.group({
      message: [''],
    });

    this.bookingFormGroup = this.fb.group({
      mealType: ['lunch'],
      dateRange: this.fb.group({
        start: [],
        end: [],
      }),
    });

    this.cancelBookingFormGroup = this.fb.group({
      mealType: ['lunch']
    });

    this.bookingListFormGroup = this.fb.group({
      month: [''],
      year: [''],
      mealType: [''],
    });

    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit(): void {
    // this.fetchBookings();

    this.updateMenu();

    this.getBookings();

    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear + 1, currentYear + 2];
  }

  updateMenu() {
    const dayOfWeek = this.selectedDate
      ? this.selectedDate.toLocaleString('en-us', { weekday: 'long' })
      : '';

    // if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
    //   this.mealMessage = 'Meal facility is closed';
    //   this.lunchMenu = [];
    //   this.dinnerMenu = [];
    // } else {
    //this.mealMessage = '';
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

  openCancelBookingForm() {
    this.dialog.open(this.cancelBookingFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur'
    });
  }

  submitCancelBooking() {
    if (this.cancelBookingFormGroup.valid) {
      const bookingDate = this.datePipe.transform(this.selectedDate,'yyyy-MM-dd');
      const mealType = this.cancelBookingFormGroup.value.mealType;

      if (bookingDate) {
        this.bookingService.cancelBooking(bookingDate, mealType).subscribe({
          next: () => {
            this.toast.success({ detail: "SUCCESS", summary: "Booking cancelled successfully!", duration: 3000 });
            this.cancelBookingFormGroup.reset();
            this.dialog.closeAll();
          },
          error: (err) => {
            this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 });
          }
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

  openBookingList() {
    this.dialog.open(this.bookingListTemplate, {
      width: '600px',
      backdropClass: 'backdrop-blur',
    });
  }

  submitFeedback() {
    if (this.feedbackFormGroup.valid) {
      console.log(this.feedbackFormGroup.value);
      // Handle the form submission
      this.dialog.closeAll();
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
        startDate: this.datePipe.transform(startDate,'yyyy-MM-dd'),
        endDate:this.datePipe.transform(endDate,'yyyy-MM-dd')
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

  getBookings(): void {
    this.bookingService.getBookingsByUserId().subscribe((data) => {
      this.bookings = data;
      this.filteredBookings = data; // Initially, show all bookings

      console.log(this.bookings);

    });
  }

  filterBookings() {
    if (this.bookingListFormGroup.valid) {
      const { month, year, mealType } = this.bookingListFormGroup.value;

      console.log(this.bookings)
  
      this.filteredBookings = this.bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        const bookingMonth = bookingDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
        const bookingYear = bookingDate.getFullYear();
        const bookingMealType = booking.mealType;
  
        // Check if all filters are empty or match the booking
        const matchesMonth = month ? bookingMonth === month : true;
        const matchesYear = year ? bookingYear === year : true;
        const matchesMealType = mealType ? bookingMealType === mealType : true;
  
        return matchesMonth && matchesYear && matchesMealType;
      });
    }

    console.log(this.filteredBookings)
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    this.fetchBookings();

    //console.log(this.mealData);
    if (cellDate && view === 'month') {
      const cellDateString = cellDate.toISOString().split('T')[0];

      //console.log('in if:', this.mealData);

      // Check if there are any bookings for the current date
      const hasBooking = this.mealData.some(
        (booking) => booking.date === cellDateString
      );

      // Determine if the current date is a weekend (Saturday or Sunday)
      const day = cellDate.getDay();
      const isWeekend = day === 0 || day === 6;

      if (hasBooking && isWeekend) {
        return 'highlight-date disabled-date';
      } else if (hasBooking) {
        return 'highlight-date';
      } else if (isWeekend) {
        return 'disabled-date';
      }
    }
    return '';
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

  fetchBookings() {
   // console.log('bookings are getting fetched!');

    this.bookingService.getBookingsByUserId().subscribe({
      next: (bookings) => {
        //console.log('Bookings:', bookings);
        this.mealData = bookings.map((booking) => ({
          userId: booking.userId,
          mealType: booking.mealType,
          //date: new Date(booking.bookingDate).toISOString().split('T')[0],
          date:this.datePipe.transform(booking.bookingDate,'yyyy-MM-dd')
        }));
        this.updateMenu(); // Update the menu once bookings are fetched
        this.setMealType();
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        // Handle the error (e.g., show an error message)
      },
    });
  }
}
