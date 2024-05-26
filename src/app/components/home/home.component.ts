import { Component, ViewEncapsulation,OnInit,TemplateRef,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { BookingService } from 'src/app/services/booking.service';

interface Meal {
  userId: number;
  mealType: string;
  date: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class HomeComponent implements OnInit{

  public mealData:Meal[] = [
    {
      userId : 1,
      mealType: "lunch",
      date: "2024-05-19"
    },
    {
      userId: 2,
      mealType: "dinner",
      date: "2024-05-20"
    },
    {
      userId: 3,
      mealType: "lunch",
      date: "2024-05-21"
    },
    {
      userId: 4,
      mealType: "dinner",
      date: "2024-05-22"
    },
    {
      userId: 5,
      mealType: "lunch",
      date: "2024-05-23"
    },
    {
      userId: 6,
    mealType: "dinner",
      date: "2024-05-24"
    },
    {
      userId: 7,
      mealType: "lunch",
      date: "2024-05-27"
    },
    {
      userId: 8,
      mealType: "dinner",
      date: "2024-05-28"
    },
    {
      userId: 9,
      mealType: "lunch",
      date: "2024-05-29"
    },
    {
      userId: 10,
      mealType: "dinner",
      date: "2024-05-30"
    }
  ];

  public lunchMenu: string[] = ['Salad', 'Paneer Sabji', 'Roti','Dal','Rice','Papad'];
  public dinnerMenu: string[] = ['Soup', 'Fried Rice', 'Salad'];

  public todayDate: Date = new Date();
  public mealType: string = '';
  public mealTaken: string = '';

  feedbackFormGroup!: FormGroup;
  bookingFormGroup!: FormGroup;
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
    { value: 11, viewValue: 'December' }
  ];
  public years: number[] = [];

  @ViewChild('feedbackForm') feedbackFormTemplate!: TemplateRef<any>;
  @ViewChild('bookingForm') bookingFormTemplate!: TemplateRef<any>;
  @ViewChild('bookingList') bookingListTemplate!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private bookingService:BookingService,
    private toast:NgToastService){
    this.feedbackFormGroup = this.fb.group({
    
      message: ['']
    });

    this.bookingFormGroup = this.fb.group({
      mealType: ['lunch'],
      dateRange: this.fb.group({
        start: [],
        end: []
      })
    });

    this.bookingListFormGroup = this.fb.group({
      month: '',
      year: '',
      mealType: ''
    });
  }

  ngOnInit(): void {
      this.setMealType();

      const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear + 1, currentYear + 2];
  }

  setMealType() {
    const hours = new Date().getHours();
    this.mealType = hours < 16 ? 'Lunch' : 'Dinner';
    const todayString = this.todayDate.toISOString().split('T')[0];
    const todayMeal = this.mealData.find(meal => meal.date === todayString);
    this.mealTaken = todayMeal ? `Meal taken: ${todayMeal.mealType}` : 'No meal taken today';
  }

  openFeedbackForm() {
    this.dialog.open(this.feedbackFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur'
    });
  }

  openBookingForm() {
    this.dialog.open(this.bookingFormTemplate, {
      width: '400px',
      backdropClass: 'backdrop-blur'
    });
  }

  openBookingList() {
    this.dialog.open(this.bookingListTemplate, {
      width: '600px',
      backdropClass: 'backdrop-blur'
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

    const booking = {
      mealType: this.bookingFormGroup.value.mealType,
      startDate: startDate.toISOString().split('T')[0], // Format to 'YYYY-MM-DD'
      endDate: endDate.toISOString().split('T')[0]     // Format to 'YYYY-MM-DD'
    };
      // Handle the form submission
      this.bookingService.createBooking(booking)
      .subscribe({
        next:(res) => {
          console.log(res);
          this.toast.success({detail:"SUCCESS",summary:"Booking added Successfully!",duration:3000});
          this.bookingFormGroup.reset();
          this.dialog.closeAll();
        },
        error:(err) => {
          console.log(err.message);
        }
      })
   
    }
  }

  filterBookings() {
    if (this.bookingListFormGroup.valid) {
      console.log(this.bookingListFormGroup.value);
      // Implement filtering logic based on the form values
      // For now, simply log the form values
    }
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (cellDate && view === 'month') {
      const cellDateString = cellDate.toISOString().split('T')[0];
      const isHighlighted = this.mealData.some(meal => meal.date === cellDateString);
      const day = cellDate.getDay();
      if (isHighlighted && (day === 0 || day === 6)) {
        return 'highlight-date disabled-date';
      } else if (isHighlighted) {
        return 'highlight-date';
      } else if (day === 0 || day === 6) {
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
}