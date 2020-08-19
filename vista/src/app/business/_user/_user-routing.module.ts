import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './_user.component';
import { UserCreateComponent } from './_user-create/_user-create.component';
import { UserDetailComponent } from './_user-detail/_user-detail.component';


const routes: Routes = [
    {
        path: '',
        component: UserComponent
    },
    {
        path: 'user-action',
        component: UserCreateComponent
    },
    {
        path: 'user-detail',
        component: UserDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
