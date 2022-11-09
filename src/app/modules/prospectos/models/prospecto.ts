export interface IProspecto {
  idu_prospecto: number;
  nom_nombre: string;
  nom_apellido_paterno: string;
  nom_apellido_materno: string;
  nom_calle: string;
  num_casa_int: number;
  num_casa_ext: string;
  nom_colonia: string;
  num_cp: string;
  num_telefono: string;
  num_rfc: string;
  des_estatus: string;
  idu_cat_estatus?: number;
  des_observacion?: string;
  idu_promotor?: number;
  idu_uuid?: string;
}