import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-options',
  templateUrl: './modalwindow.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./page.component.css'],
})

export class NgbdModalOptions {
    closeResult: string;
  
    constructor(private modalService: NgbModal) {}
  
    openBackDropCustomClass(content) {
      this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
    }
  
    openWindowCustomClass(content) {
      this.modalService.open(content, { windowClass: 'dark-modal' });
    }
  
    openSm(content) {
      this.modalService.open(content, { size: 'sm' });
    }
  
    openLg(content) {
      this.modalService.open(content, { size: 'lg' });
    }
  
    openVerticallyCentered(content) {
      this.modalService.open(content, { centered: true });
    }
  }