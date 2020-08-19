import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HomeModule } from 'src/app/_core/home/home.module';

@Injectable({
  providedIn: HomeModule
})
export class PolicyCommonService {

  // loader
  public loaderSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public showLoader() {
    this.loaderSubject.next(true);
  }

  public hideLoader() {
    this.loaderSubject.next(false);
  }
}
