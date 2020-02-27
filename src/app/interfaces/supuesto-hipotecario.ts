export interface SupuestoHipotecario {
    id?: number;
    porcentaje_comision_apertura: string;
    porcentaje_enganche: string;
    duracion_credito: string;
    tasa_interes: string;
    tasa_extra?: string;
    repago_capital?: string;
    porcentaje_descuento: string;
    desarrollo_id: number;
    created_at?: string;
    updated_at?: string;
}
