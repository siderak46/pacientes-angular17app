import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service';
import { LoginI } from '../../modelos/login.interface';
import { ResponseI } from '../../modelos/response.interface';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  loginForm = new FormGroup({
    usuario : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required),
  })
  constructor(
    private api:ApiService,
     private router:Router,
     
     ){}
  
  errorStatus:boolean = false;
  errorMjs:any ="";

  ngOnInit():void{
      if(this.isLocalStorageAvailable()){
        this.checkLocalStorage();
      }
  }

  checkLocalStorage(){
    if(localStorage.getItem('token')){
      let token = localStorage.getItem('token');
      this.checkToken(token);
      this.router.navigate(['dashboard']);
    }
  }
  checkToken(token : any): void {
    this.api.getStateToken(token).subscribe(
      data => {
        let dataResponse:ResponseI = data;
        if(dataResponse.status=="error"){
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        }
      });
  }

  isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== null;
  }
  
  onLogin(){
    const formValue = this.loginForm.value;
    const loginData: LoginI = {
      usuario: formValue.usuario ?? '',
      password: formValue.password ?? '',
    };
    this.api.loginByEmail(loginData).subscribe(data => {
      let dataResponse:ResponseI = data;
      if(dataResponse.status=="ok"){
        localStorage.setItem("token",dataResponse.result.token);
        this.router.navigate(['dashboard']);
      }else{
        this.errorStatus=true;
        this.errorMjs=dataResponse.result.error_msg;
      }
    });
  
    
    
  }
  
}

