import { environment } from "src/environments/environment"

const dtOptionsData = {
    paging: true,
    deferRender:true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: true,
    pageLength: 10,
    processing: true,
    //scrollY: '300px',
    //scrollX: true,
    responsive: true,
    dom: 'Blfrtip',
    buttons: [
        //{ text: 'Columnas',extend: 'colvis', className: 'btn btn-secondary mb-3'},
        //'copy', 'csv', 'excel', 'pdf', 'print'
        //{ text: 'Exportar en excel',extend: 'excel', className: 'btn btn-success mb-3' ,exportOptions: { columns: [ 0, 1, 2, 3, 4, 5 ] } },
        { text: 'Descargar en Excel',extend: 'excel', className: 'btn btn-danger mb-3', exportOptions: { columns: ':not(:last-child)'  }},
        //{ text: 'Csv',extend: 'csv', className: 'btn btn-secondary mb-3'},
    ],
    language: {
        processing: "Procesando...",
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        emptyTable: "Ningun dato disponible en esta lista",
        info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        infoPostFix: "",
        search: "Buscar:",
        url: "",
        infoThousands: ",",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        },
        aria: {
            sortAscending: ": Activar para ordenar la columna de manera ascendente",
            sortDescending: ": Activar para ordenar la columna de manera descendente"
        }
    },
}


export { 
    dtOptionsData,
};