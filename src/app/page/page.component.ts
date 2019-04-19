// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
// import { DialogWindow } from '../opendialog/opendialog.component'
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { AppComponent } from '../app.component';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  tagsSelect: Tags[];
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
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.sidebar = single_page.sidebar;
    this.id = single_page.id
    this.isCurrent = true;
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
        this.tagsSelect = this.tagsArray;
        // console.log(this.tagsArray);
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
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "id": this.id,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "sidebar": this.sidebar,
      "isactive": this.isactive,
    };

    console.log(body);
    

    this.apiService.updatePageData(body)
      .subscribe(
        (p: any) => {
          p = this.top_page;
        }
      );
  }

}
