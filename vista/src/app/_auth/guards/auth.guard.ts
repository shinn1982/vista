import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { CommonService } from 'src/app/_common/services/common.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private commonService: CommonService) { }

  private checkLogin(url: string): boolean {
    const currentUserObj: any = this.commonService.getCurrentUserInfos();
    if (currentUserObj && currentUserObj.access_token) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return true;
  }

  public canLoad(
    route: Route,
    segments: UrlSegment[]): boolean {
    return true;
  }
}
