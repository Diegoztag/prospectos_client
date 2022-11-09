import { Component, OnInit, EventEmitter } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { IProspecto_lista } from '../models/prospecto_lista';
import { IEstatus } from '../models/estatus';
import { Mensaje } from '../../../models/mensaje';
import { ProspectosService } from '../services/prospectos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-prospectos-list',
  templateUrl: './prospectos-list.component.html',
  styles: [
    `
      .tab-width-5:{width: 5%;}
      .tab-width-10:{width: 10%;}
      .tab-width-15:{width: 15%;}
      .tab-width-40:{width: 40%;}
    `,
  ],
})
export class ProspectosListComponent implements OnInit {
  @BlockUI('prospectos-list') public blockUI: NgBlockUI;

  public openPdf = new EventEmitter();
  public opcion: string;
  public cols: any[];
  public prospectos: IProspecto_lista[];
  public estatus: IEstatus[];

  public page: number;
  public itemsPerPage: number;
  public maxSize: number;
  public numPages: number;
  public length: number;
  public config: any;
  public mensaje: Mensaje;
  public key: string;
  public reverse: boolean;
  public currentPage: number;

  constructor(
    private prospectosService: ProspectosService,
    private toasterService: ToasterService,
  ) {
    this.page = 1;
    this.itemsPerPage = 5;
    this.maxSize = 5;
    this.numPages = 1;
    this.length = 0;
    this.key = 'id';
    this.reverse = false;
    this.currentPage = 1;
    this.mensaje = new Mensaje(toasterService);
  }

  public ngOnInit() {
    this.cols = [
      { field: 'nom_nombre', header: 'Nombre' },
      { field: 'idu_cat_estatus', header: 'Estatus' },
      { field: 'fec_creado', header: 'Fecha' },
    ];

    this.estatus = [
      { value: null, label: 'TODOS LOS ESTATUS' },
      { value: 1, label: 'ENVIADO' },
      { value: 2, label: 'AUTORIZADO' },
      { value: 3, label: 'RECHAZADO' },
    ];
    this.cargarDatos();
  }

  public cargarDatos() {
    this.blockUI.start('Cargando...');
    this.prospectosService.obtener().subscribe((result) => {
      this.prospectos = result.data;
      this.length = this.prospectos.length;
      this.blockUI.stop();
    }, (error) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Hubo un problema',
        text:'No se pudo obtener el listado de prospectos',
        showConfirmButton: false,
        timer: 3000});
    });
  }

  public consultarPdf() {
    this.prospectosService.obtenerPdf().subscribe((dataFile) => {
      this.opcion = 'modal';
      this.openPdf.emit(dataFile);
    });
  }

  public info($event, col) {
    // Ejecuta alguna accion  //console.log($event, col);
  }
}
