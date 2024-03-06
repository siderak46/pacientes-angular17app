import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';
import { ApiService } from '../../servicios/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { listaPacientesI } from '../../modelos/listapacientes.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    CommonModule
  ],
  providers: [ApiService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent{


  constructor(
    private api:ApiService, 
    private router:Router,
    ){}

  pacientes: listaPacientesI[] = [];

  ngOnInit():void{
    this.api.getAllPatients(1).subscribe(
      data=>{this.pacientes = data;}
      
    )
  }

  editarPaciente(id: any){
    this.router.navigate(['editar',id]);
  }

  nuevoPaciente(){
    this.router.navigate(['nuevo']);
  }

  logOut(){
    
    console.log(this.api.removeToken());
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== null;
  }
}
   