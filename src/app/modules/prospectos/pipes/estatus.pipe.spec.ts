import { EstatusPipe } from './estatus.pipe';

describe('Estatus Pipe', () => {
    let pipe: EstatusPipe

    beforeEach(() => {
        pipe = new EstatusPipe();
    });

    it('Creacion del pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('Se puede usar el transfor correctamente', () => {
        const case0 = pipe.transform(0);
        const case1 = pipe.transform(1);
        const case2 = pipe.transform(2);
        const case3 = pipe.transform(3);

        expect(case0).toBe('Nuevo');
        expect(case1).toBe('Activo');
        expect(case2).toBe('Inactivo');
        expect(case3).toBe('Desconocido');
    });
});
