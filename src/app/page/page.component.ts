// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
// import { DialogWindow } from '../opendialog/opendialog.component'
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { AnyARecord } from 'dns';
// import { MdCheckboxModule } from '@angular/material';

// datatables 


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class PageComponent implements OnInit {

  public internal = true;    // change to false to use external db
  public external = false;
  
  //includes

  @ViewChildren('nGForArray')filtered;
  @ViewChildren('formPage') formValues;

  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;
  public title;
  public description;
  public icon;
  public isactive;
  public sidebar;
  public id;
  
  public isPageFormVisible = false;
  public isCurrent = false;

  url: string;
  top_page: Page[];
  tagsArray: Tags[];
  tagsSelect: Array<Tags> = [];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];
  formPage: FormGroup; 
  iOptions: string[] = [
    "pe-7s-album",
    "pe-7s-arc",
    "pe-7s-back-2",
    "pe-7s-bandaid",
    "pe-7s-car",
    "pe-7s-diamond",
    "pe-7s-door-lock",
    "pe-7s-eyedropper",
    "pe-7s-female",
    "pe-7s-gym",
    "pe-7s-hammer",
    "pe-7s-headphones",
    "pe-7s-helm",
    "pe-7s-hourglass",
    "pe-7s-leaf",
    "pe-7s-magic-wand",
    "pe-7s-male",
    "pe-7s-map-2",
    "pe-7s-next-2",
    "pe-7s-paint-bucket",
    "pe-7s-pendrive",
    "pe-7s-photo",
    "pe-7s-piggy",
    "pe-7s-plugin"
    
  ];

  

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private apiService: APIService,
    private mainApp: AppComponent,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    // private dialog: DialogWindow,
    private location: Location
  ) { }

  ngOnInit() {
    this.getData();
    this.getParams();
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tag':
          this.tag = values[0];
          break;
      }
    }
    if (keys[0] === 'tag') {

      this._router.navigate(['edit'], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate(['edit'], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }

  clearForm(currentForm: Page): void {
    this.title = "";
    this.description = "";
    this.icon = "";
    this.isactive = null;
    this.sidebar = null;
    this.id = null;
    this.clearCheckedTags()
  }

  clearCheckedTags(): void {
    for(let i = 0; i < this.tagsArray.length; i++) {
      this.tagsArray[i].isChecked = false;
    }
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  createRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    console.log(body);


    this.apiService.postPageData(body)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );
  }

  

  deleteRequest(): void {
    this.apiService.removePageData(this.id)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );

  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tag':
          this.tag = q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;

      }
    }
  }


  fillform(single_page): void {
    this.clearCheckedTags()
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.sidebar = single_page.sidebar;
    this.id = single_page.id
    this.isCurrent = true;
    this.tagsSelect = single_page.tags;
    var i;

    for (i = 0; i < this.tagsSelect.length; i++) {
      for (let j = 0; j < this.tagsArray.length; j++) {
        if (this.tagsSelect[i].id == this.tagsArray[j].id) {
          this.tagsArray[j].isChecked = true;
        }
      }
    }
  }

  getData(): any {
    //console.log(this.baseURL);
    this.apiService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(this.top_page);
      });
    this.apiService.getTagData(this.mainApp.internal_db)
      .subscribe(tagArray => {
        this.tagsArray = tagArray;
      });
    
    this.apiService.getSubpageData(this.mainApp.internal_db)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.apiService.getConnectTags(this.mainApp.internal_db)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getTags(page): string {
    var pagetags = "";
    if (page.tags) {
      for (let i = 0; i < page.tags.length; i++) {
        pagetags = pagetags + (page.tags[i].tag);
        if (page.tags[i + 1]) {
          pagetags = pagetags + ", ";
        }
      }
    }
    return pagetags;
  }

  openWindow(): void {
    console.log("open dialog window");
    // this.dialog.openDialog();
  }

  updateRequest(): void {
    var tID;
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;

    this.tagsSelect = [];

    for (let i = 0; i < this.tagsArray.length; i++) {
      if (this.tagsArray[i].isChecked == true) {
        this.tagsSelect.push(this.tagsArray[i])
      }
    }

    const body = {
      "id": this.id,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    // this.apiService.updatePageData(body)
    //   .subscribe(
    //     (p: any) => {
    //       p = this.top_page;
    //     }
    //   );
    var i;
    var j;

    console.log(this.connect_tags);
    
    for (i = 0; i < this.tagsSelect.length; i++) {
      console.log(" i is " + i);
      for (j = 0; j < this.connect_tags.length; j++) {
        console.log(" j is " + j);

          if (this.connect_tags[j].pageid == this.id && this.connect_tags[j].tagid == this.tagsSelect[i].id) {
            console.log('do nothing  connect_tag pageid: ' + this.connect_tags[j].pageid  + " tagsSelect tagid = " + this.tagsSelect[i].id);
            // break;
          }
          else if (this.connect_tags[j].pageid == this.id && this.connect_tags[j].tagid != this.tagsSelect[i].id) {
            const tagBody = {
                "id": this.connect_tags[j].id,
                "pageid": this.id,
                "tagid": this.connect_tags[j].tagid
              }
            console.log('delete connect_tag pageid: ' + this.connect_tags[j].pageid  + " tagsSelect tagid = " + this.tagsSelect[i].id + " connect_tags id " + this.connect_tags[j].id);
            // break;
          }
          else {
            const tagBody = {
                "id": this.connect_tags.length + 1,
                "pageid": this.id,
                "tagid": this.tagsSelect[i].id
                }
            console.log('write new record  connect_tag pageid: ' + this.connect_tags[j].pageid  + " tagsSelect tagid = " + this.tagsSelect[i].id);
          }
      }
    }
      
        // if (this.connect_tags[j].pageid == this.id) {
        //   if (this.connect_tags[j].tagid == this.tagsSelect[i].id) {
        //     console.log("do NOT WRITE");
        //     console.log("connect_tags: " + j + "   tagsSelect: " + i);
        //     break;
        //   }
        //   // console.log("in the first if with i: " + i)          
          
        // }
        

      // console.log("no MATCH, create new");
      // console.log("connect_tags: " + j + "   tagsSelect: " + i);


      // const tagBody = {
      //   "id": this.connect_tags.length + 1,
      //   "pageid": this.id,
      //   "tagid": this.tagsSelect[j].id
      //   }
      // console.log("no MATCH, create new");
      // console.log(tagBody);
      // const tagBody = {
      //   "id": this.connect_tags[i].id,
      //   "pageid": this.id,
      //   "tagid": this.tagsSelect[j].id
      // }

    // this.apiService.updateConnectTags(tagBody)
    //   .subscribe(
    //     (c: any) => {
    //     c = this.connect_tags;
    //     //console.log(connect_tags);
    //   });
  }

}
