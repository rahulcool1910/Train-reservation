import { HomeComponent } from './home/home.component';
import { User } from './../models/User';
import { SwiperContainer } from './../new/swiper/swiper.component';
import { HomeService } from './home.service';
import {
  Component,
  ElementRef,
  OnInit,
  AfterContentInit,
  HostListener,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ViewChild } from '@angular/core';

import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface,
} from 'ngx-swiper-wrapper';
import Swiper from 'swiper';
import { ModalController } from '@ionic/angular';
import Scrollmagic from 'scrollmagic';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {
  @ViewChild('homeSlide', { static: false }) public homeSlide: SwiperContainer;
  myswiper: Swiper;
  form: FormGroup;

  selected_From: string = '';
  selected_To: string = '';
  Bothsame = false;
  fetched_trains: any[] = [];
  stations1: any = [
    'chennai',
    'mumbai',
    'lucknow',
    'delhi',
    'jammu',
    'bangalore',
  ];
  stations2: any = [
    'chennai',
    'mumbai',
    'lucknow',
    'delhi',
    'jammu',
    'bangalore',
  ];
  month_name = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep♥',
    'Oct',
    'Nov',
    'Dec',
  ];

  from = new FormControl();
  to = new FormControl();
  date: any;
  // date = new FormControl();
  displayedColumns: string[] = ['train-no', 'train-name', 'from', 'to'];
  User_data: User = {
    uid: '',
    email: '',
    photoURL: '',
    displayName: '',
  };
  is_logged_in: boolean = false;
  dates: any[] = [];
  days: any[] = [];
  choosen_date;
  available: any[] = [];

  public swipeOptions = {
    effect: 'coverflow',
    grabCursor: true,

    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 1,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };
  goToNextPage() {
    this.homeSlide.swiper.slideNext();
  }
  so: any;
  constructor(private service: HomeService, public modal: ModalController) {
    const check = this.service.get_login();
    if (check.uid !== null) {
      this.User_data = check;
      this.is_logged_in = true;
    }
    this.service.get_user_data().subscribe((data) => {
      if (data.uid !== '') {
        this.is_logged_in = true;
        this.User_data = data;
        console.log(data, this.is_logged_in);
      }
    });

    this.form = new FormGroup({
      from: new FormControl(null, { validators: [Validators.required] }),
      to: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
    });
    // this.dataSource = new MatTableDataSource(Element);
  }

  filteredOptions_from: Observable<string[]>;
  filteredOptions_to: Observable<string[]>;
  scrollRef = 0;
  ngOnInit() {
    this.filteredOptions_from = this.from.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.filteredOptions_to = this.to.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  ngAfterContentInit() {
    // var controller=new Scrollmagic.
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stations1.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  getdate(eve: any) {
    this.date = eve.target.value;
  }
  Submit() {
    if (this.from.invalid || this.to.invalid) {
      return;
    }
    if (this.from.value == this.to.value) {
      this.Bothsame = true;
      return;
    }
    console.log(this.date);
    this.Bothsame = false;
    this.form.setValue({
      from: this.from.value,
      to: this.to.value,
      date: this.date,
    });

    this.service.get_trains(this.form.value);
    this.service.get_trains_sub().subscribe((data) => {
      this.available = [];

      console.log(data);
      let date = new Date(this.date).getTime();

      for (let i = 0; i < 5; i++) {
        let new_date = new Date(date);
        for (let j = 0; j < data.departs_on.length; j++) {
          if (data.departs_on[j] == new_date.getDay()) {
            data.dates = new_date.toString().split(' ').join('/').slice(4, 15);
            this.available.push(data);
          }
        }

        console.log(this.available);

        date += 60000 * 24 * 60;
      }
    });
  }

  async Open_modal(item: any) {
    let new_modal = await this.modal.create({
      component: HomeComponent,
      componentProps: {
        data: item,
      },
    });
    return await new_modal.present();
  }
  signin() {
    this.service.login();
  }
  logout() {
    this.service.logout();
    this.is_logged_in = false;
  }
}
