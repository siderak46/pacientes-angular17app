import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor(private toast:ToastrService) { }

  showSuccess(text:any,title:any){
    this.toast.success(text,title);
  }
  showError(text:any,title:any){
    this.toast.error(text,title);
  }
}
