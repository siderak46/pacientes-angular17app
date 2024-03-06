import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteI } from '../../modelos/paciente.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditarPacienteI } from '../../modelos/editarpaciente.interface';
import { ResponseI } from '../../modelos/response.interface';
import { AlertasService } from '../../servicios/alertas/alertas.service';

@Component({
  selector: 'app-editar',
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
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {
  constructor(
    private activerouter:ActivatedRoute,
    private router:Router,
    private api:ApiService, 
    private alertas:AlertasService,
    ){}
    
    datosPaciente!: PacienteI;
    editarForm= new FormGroup({
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
    let pacienteid = this.activerouter.snapshot.paramMap.get('id');
    let token=this.getToken();
    this.api.getSinglePacient(pacienteid).subscribe((data: any) => {
      this.datosPaciente = data[0];
      this.editarForm.setValue({
        'nombre': this.datosPaciente.Nombre,
        'dni': this.datosPaciente.DNI,
        'correo': this.datosPaciente.Correo,
        'telefono': this.datosPaciente.Telefono,
        'direccion': this.datosPaciente.Direccion,
        'codigoPostal': this.datosPaciente.CodigoPostal,
        'genero': this.datosPaciente.Genero,
        'fechaNacimiento': this.datosPaciente.FechaNacimiento,
        'pacienteId':  pacienteid,
        'token': token
      });
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
    const formValue = this.editarForm.value;
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
    this.api.putPatient(Paciente).subscribe(data =>{
      let respuesta: ResponseI =data;
      if(respuesta.status=="ok"){
        this.alertas.showSuccess('Datos modificados','Hecho');
      }else{
        this.alertas.showError(respuesta.result.error_msg,'Error');
      }
    })
    
  }

  eliminar(){
    const formValue = this.editarForm.value;
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
    this.api.deletePatient(Paciente).subscribe(data => {
      let respuesta: ResponseI =data;
      if(respuesta.status=="ok"){
        this.alertas.showSuccess('Paciente eliminado','Hecho');
        this.router.navigate(['dashboard']);
      }else{
        this.alertas.showError(respuesta.result.error_msg,'Error');
      }
    })   
  }

  salir(){
    this.router.navigate(['dashboard']);
  }
}
