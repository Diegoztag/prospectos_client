import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecureStorageService } from 'src/app/services/secure-storage.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToasterService, Toast } from 'angular2-toaster';
import { ProspectosService } from '../services/prospectos.service';
import { IProspecto } from '../models/prospecto';
import { Mensaje } from '../../../models/mensaje';
import { FileUploader } from 'ng2-file-upload';
import { IDocumento } from '../models/documento';
import Swal from 'sweetalert2';
import { ConfigService } from '../../../services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-prospectos-form',
  templateUrl: './prospectos-form.component.html',
})
export class ProspectosFormComponent implements OnInit, OnDestroy {
  @BlockUI('prospecto-data') public blockUI: NgBlockUI;

  public prospecto: IProspecto;
  public docs: IDocumento;
  public title: string;
  public prospectoForm: UntypedFormGroup;
  public mensaje: Mensaje;
  public idu_prospecto: number;
  public maskTelefono: any;
  public uploader: FileUploader;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public configService: ConfigService,
    private prospectosService: ProspectosService,
    private fb: UntypedFormBuilder,
    private toasterService: ToasterService,
    private secureStorage: SecureStorageService,
  ) {
    this.mensaje = new Mensaje(this.toasterService);
    this.maskTelefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  }

  public ngOnInit() {
    this.prospectoForm = this.fb.group({
      idu_prospecto: new UntypedFormControl(0),
      nom_nombre: new UntypedFormControl('', Validators.required),
      nom_apellido_paterno: new UntypedFormControl('', Validators.required),
      nom_apellido_materno: new UntypedFormControl(''),
      nom_calle: new UntypedFormControl('', Validators.required),
      nom_colonia: new UntypedFormControl('', Validators.required),
      num_casa_ext: new UntypedFormControl('', Validators.required),
      num_casa_int: new UntypedFormControl(''),
      num_cp: new UntypedFormControl('', Validators.required),
      num_telefono: new UntypedFormControl('', Validators.required),
      num_rfc: new UntypedFormControl('', Validators.required),
      idu_cat_estatus: new UntypedFormControl(''),
      des_observacion: new UntypedFormControl(''),
      idu_promotor: new UntypedFormControl(parseInt(this.secureStorage.getItem('currentUser')))
    });

    this.uploader = new FileUploader({
      url: this.configService.config.webApiBaseUrl + '/prospectos/files',
      });

    this.uploader.onAfterAddingFile = (item) => {
      item.withCredentials = false;
    };

    this.uploader.onCompleteItem=(item:any, response:any, status:any, header:any)=>{
    };

    this.sub = this.route.params.subscribe((params) => {
      this.idu_prospecto = +params['id'];
      this.title = this.idu_prospecto ? 'Datos Prospecto' : 'Nuevo Prospecto';
      if (this.idu_prospecto) {
        this.blockUI.start('Loading...');
        this.prospectosService.obtenerPorId(this.idu_prospecto).subscribe((result) => {
          this.prospecto = result.data[0][0];
          this.docs = result.data[1];
          this.inicializarFormulario(this.prospecto);
          this.blockUI.stop();
        });
      }
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public inicializarFormulario(data: IProspecto) {
    this.prospectoForm.disable();
    this.prospectoForm.setValue({
      idu_prospecto: this.idu_prospecto ? this.idu_prospecto : 0,
      nom_nombre: data.nom_nombre,
      nom_apellido_paterno: data.nom_apellido_paterno,
      nom_apellido_materno: data.nom_apellido_materno ? data.nom_apellido_materno : null,
      nom_calle: data.nom_calle,
      nom_colonia: data.nom_colonia,
      num_casa_ext: data.num_casa_ext,
      num_casa_int: data.num_casa_int ? data.num_casa_int : '0',
      num_cp: data.num_cp,
      num_telefono: data.num_telefono,
      num_rfc: data.num_rfc,
      idu_cat_estatus: data.idu_cat_estatus ? data.idu_cat_estatus : 1,
      des_observacion: data.des_observacion ? data.des_observacion : null,
      idu_promotor: parseInt(this.secureStorage.getItem('currentUser')),
    });
  }

  public enviar(uploader: any) {
    let doc: IDocumento;
    let uuid = uuidv4();
    this.prospectoForm.value.idu_uuid = uuid;
    let prospecto: IProspecto = this.prospectoForm.value;

    this.prospectosService.guardar(prospecto).subscribe(
      (res) => {

        if(uploader.queue.length) {

          for (let i = 0; i < uploader.queue.length; i++) {
            doc = {
              nom_documento: uploader.queue[i].file.name.replace(/ /g, ""),
              idu_uuid: uuid
            }

            this.prospectosService.guardarDoc(doc).subscribe((res)=>{
            }, (error) => {})
          }
          uploader.uploadAll();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Éxito',
            text: 'Prospecto Creado Correctamente & Archivos subidos',
            showConfirmButton: false,
            timer: 1500
          })
          this.resetForm();
          this.regresar();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Éxito',
            text: 'Prospecto Creado Correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.resetForm();
          this.regresar();
        }
      },
      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Hubo un problema',
          text: 'No se Pudo Crear el Prospecto',
          showConfirmButton: false,
          timer: 1500});
      }
    );
  }

  public resetForm() {
    this.prospectoForm.reset();
  }

  public regresar() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    if(this.prospectoForm.dirty) {

      swalWithBootstrapButtons.fire({
        text: "Si regresas perderas los datos en el formulario",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/prospectos']);
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {}
      })
    } else {
      this.router.navigate(['/prospectos']);
    }
  }

  public bajarArchivo(nombre: string) {
    let extencion = nombre.split('.').pop();
    this.prospectosService.obtenerArchivo(nombre, extencion)
    .subscribe((resp) => {
    },(error)=>{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un problema',
        text: 'Archivo no encontrado',
        showConfirmButton: false,
        timer: 1500});
    });
  }

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
  }
}
