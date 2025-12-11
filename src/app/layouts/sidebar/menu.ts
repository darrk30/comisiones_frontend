import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'Menú',
        isTitle: true
    },
    {
        id: 2,
        label: 'Panel de Control',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'Principal',
                link: '/',
                parentId: 2
            },
        ]
    },
    {
        id: 4,
        label: 'Mantenimiento',
        icon: 'bx-wrench',
        subItems: [
            // {
            //     id: 5,
            //     label: 'Instituciones',
            //     link: '/mantenimiento/institucion',
            //     parentId: 4
            // }
        ]
    },
    {
        id: 6,
        label: 'Operaciones',
        icon: 'bx-cog',
        subItems: [
            {
                id: 7,
                label: 'Comisiones',
                link: '/negocio/comision',
                parentId: 6
            },
            {
                id: 8,
                label: 'Reuniones',
                link: '/negocio/reunion',
                parentId: 6
            },
            {
                id: 9,
                label: 'Seguimiento',
                link: '/negocio/revision',
                parentId: 6
            }
        ]
    },
    {
        id: 11,
        label: 'Reporte',
        icon: 'bx-wrench',
        subItems: [
            // {
            //     id: 5,
            //     label: 'Convenio',
            //     link: '/reporte/convenio',
            //     parentId: 4
            // }
        ]
    },
];

