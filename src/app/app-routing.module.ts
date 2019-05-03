import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent }      from './page/page.component';
import { SubpageComponent } from './subpage/subpage.component';
import { EditpageComponent } from './editpage/editpage.component';
//import { homedir } from 'os';


const routes: Routes = [
  { path: 'root', component: PageComponent },
  { path: '', component: PageComponent, pathMatch: 'full' },
  { path: 'course', component: SubpageComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule]
})
export class AppRoutingModule { 

}
