import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpaceComponent } from './space.component';
import { SpaceCreateComponent } from './space-create/space-create.component';
import { SpaceDetailComponent } from './space-detail/space-detail.component';
import { SpaceUserComponent } from './space-user/space-user.component';


const routes: Routes = [
    {
        path: '',
        component: SpaceComponent
    },
    {
        path: 'space-action',
        component: SpaceCreateComponent
    },
    {
        path: 'space-detail',
        component: SpaceDetailComponent
    },
    {
        path: 'space-user',
        component: SpaceUserComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpaceRoutingModule { }
