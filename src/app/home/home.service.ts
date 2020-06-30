import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  trains = new Subject<any>();
  login_status = new Subject<User>();
  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.get_login();
  }
  get_trains(form) {
    // let header = new HttpHeaders();
    // header.append('Content-Type', 'Application/json');
    // this.http
    //   .post<any>('http://localhost:5500/api/get', form, { headers: header })
    //   .subscribe((data) => {
    //     console.log(data);
    //   });

    // this.trains.next();
    this.trains = new Subject<any[]>();
    this.afs
      .collection('Trains', (ref) =>
        ref
          .where('from_city', '==', form.from)
          .where('to_city', '==', form.to)
          .limit(10)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data: any = a.payload.doc.data();
            data.id = a.payload.doc.id;
            this.trains.next(data);
          });
        })
      )
      .subscribe();
  }

  get_trains_sub() {
    return this.trains.asObservable();
  }

  async login() {
    // const provider = new auth.GoogleAuthProvider();
    // console.log(provider);
    const credential = await this.afAuth.signInWithPopup(
      new auth.GoogleAuthProvider()
    );
    this.update_user(credential.user);
  }
  update_user(data) {
    let new_data = {
      uid: data.uid,
      email: data.email,
      photoURL: data.photoURL,
      displayName: data.displayName,
    };
    this.login_status.next(new_data);
    this.afs.doc(`users/${data.uid}`).set(new_data, { merge: true });
    this.save_data(new_data);
  }

  save_data(data) {
    localStorage.setItem('uid', data.uid);
    localStorage.setItem('email', data.email);
    localStorage.setItem('displayName', data.displayName);
    localStorage.setItem('photoURL', data.photoURL);
  }

  delete_data() {
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    localStorage.removeItem('photoURL');
    let User_data: User = {
      uid: '',
      email: '',
      photoURL: '',
      displayName: '',
    };
    this.login_status.next(User_data);
  }

  get_login() {
    let User_data = {
      uid: localStorage.getItem('uid'),
      email: localStorage.getItem('email'),
      displayName: localStorage.getItem('displayName'),
      photoURL: localStorage.getItem('photoURL'),
    };
    // console.log(User_data);
    return User_data;
    this.login_status.next(User_data);
  }

  get_user_data() {
    return this.login_status.asObservable();
  }
  logout() {
    this.delete_data();
  }
  // observer = new IntersectionObserver((entries) => {
  //   entries.map((entry) => {
  //     if (entry.isIntersecting) {
  //       entry.target.classList('newcheck');
  //     }
  //   });
  // });
}
