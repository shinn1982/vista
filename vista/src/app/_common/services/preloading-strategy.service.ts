import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreloadingStrategyService implements PreloadingStrategy {

    public preloadModules: string[] = [];

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data.preload) {
            this.preloadModules.push(route.path);
            console.log('Preload', route.path);
            return load();
        }
        return of(null);
    }
}
