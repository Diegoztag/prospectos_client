export interface IProspecto_lista {
  idu_prospecto: number;
  nom_nombre: string;
  nom_apellido_paterno: string;
  nom_apellido_materno: string;
  des_estatus: string;
  idu_cat_estatus?: number;
  des_observacion?: string;
  fec_creado: Date;
}