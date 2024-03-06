import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../servicios/alertas/alertas.service';
import { EditarPacienteI } from '../../modelos/editarpaciente.interface';
import { ResponseI } from '../../modelos/response.interface';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [ApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})
export class NuevoComponent {

  constructor(
    private activerouter:ActivatedRoute,
    private router:Router,
    private api:ApiService, 
    private alertas:AlertasService,
    ){}

  nuevoForm= new FormGroup({
    nombre: new FormControl(''),
    dni: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
    codigoPostal: new FormControl(''),
    genero: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    pacienteId: new FormControl(''),
    token: new FormControl('')
  });

  ngOnInit():void{
    let token = this.getToken();
    this.nuevoForm.patchValue({
      'token' : token
    })
  }

  getToken():string | null {
    if(this.isLocalStorageAvailable())
      return localStorage.getItem('token') || '';
    else return null;
  }

isLocalStorageAvailable(): boolean {
  return typeof window !== 'undefined' && window.localStorage !== null;
  }

  postForm(){
    const formValue = this.nuevoForm.value;
    const Paciente: EditarPacienteI = {
      nombre: formValue.nombre ?? '',
      dni: formValue.dni ?? '',
      correo: formValue.correo ?? '',
      telefono: formValue.telefono ?? '',
      direccion: formValue.direccion ?? '',
      codigoPostal: formValue.codigoPostal ?? '',
      genero: formValue.genero ?? '',
      fechaNacimiento: formValue.fechaNacimiento ?? '',
      pacienteId: formValue.pacienteId ?? '',
      token: formValue.token ?? ''
    };
    this.api.postPatient(Paciente).subscribe(data =>{
      let respuesta: ResponseI =data;
      if(respuesta.status=="ok"){
        this.alertas.showSuccess('Paciente creado','Hecho');
      }else{
        this.alertas.showError(respuesta.result.error_msg,'Error');
      }
    }, ()=>{
      let respuesta: ResponseI;
      this.alertas.showError('Algo salio mal','Error');})
    
    
  }


  salir(){
    this.router.navigate(['dashboard']);
  }
}
