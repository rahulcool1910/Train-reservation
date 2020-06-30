import { ModalController } from '@ionic/angular';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input() data: any;
  fare: any = 0;
  couch: any = 'sleeper';
  constructor(
    private camera: Camera,
    private modal: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.fare = this.data.sleeper_fare;
    // you can subscribe to WOW observable to react when an element is revealed
    console.log(this.data);
  }
  farechange(eve: any) {
    this.couch = eve;
    this.fare = this.data[this.couch];
  }
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        // Do something with the new photo
        console.log(imageData);
      },
      (err) => {
        // Handle error
        console.log('Camera issue: ' + err);
      }
    );
  }
  onClick() {
    this.modal.dismiss();
    this.router.navigate(['/login']);
  }
}
