import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as echarts from 'echarts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent implements OnInit {
  logs: any[] = [];
  Especialidades: any[] = [];
  EspecialidadesxTurno: any[] = [];
  chartOption1: EChartsOption = {};
  chartOption2: EChartsOption = {};
  chartOption3: EChartsOption = {};
  chartOption4: EChartsOption = {};
  chartOption5: EChartsOption = {};
  fechaInicio: string = '2023-01-01';
  fechaInicio2: string = '2023-01-01';
  fechaFin: string = '2023-12-31';
  fechaFin2: string = '2023-12-31';
  loading: boolean = false;
  charts: any = [];
  [key: string]: any;
  constructor(
    private firestoreService: FirebaseService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cargar().then(() => {
      this.createChart();
      this.createChart2();
      this.createChart3();
      this.createChart4();
      this.createChart5();
      for (let i = 1; i <= 5; i++) {
        let titulo = '';
        switch (i) {
          case 1:
            titulo = 'Ingresos al sistema';
            break;
          case 2:
            titulo = 'Turnos por Especialidad';
            break;
          case 3:
            titulo = 'Turnos por Dia';
            break;
          case 4:
            titulo = 'Turnos solicitado por médico en un lapso de tiempo';
            break;
          case 5:
            titulo = 'Turnos finalizados por médico en un lapso de tiempo';
            break;
        }
        let chart = {
          chartOption: this['chartOption' + i],
          id: i.toString(),
          hasDateFilter: i > 3,
          fechaInicio: i > 3 ? this['fechaInicio' + (i - 3)] : undefined,
          fechaFin: i > 3 ? this['fechaFin' + (i - 3)] : undefined,
          createChart: this['createChart' + i],
          Titulo: titulo,
        };

        this.charts.push(chart);
      }
      console.log(this.charts);

      this.zone.run(() => {
        this.loading = false;
      });
    });
  }

  exportPDF(id: string) {
    let chartElement = document.getElementById(id); // Asegúrate de que este es el id correcto
    let myChart: echarts.ECharts | undefined;
    if (chartElement) {
      myChart = echarts.getInstanceByDom(chartElement);
      if (myChart) {
        let base64 = myChart.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff',
        });
        if (base64) {
          let docDefinition = {
            content: [
              {
                image: base64,
                width: 500,
              },
            ],
          };

          pdfMake.createPdf(docDefinition).download('grafico');
        }
      }
    }
  }

  base64ToBlob(base64: string, type: string): Blob {
    const binStr = atob(base64.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], { type: type });
  }
 

  async cargar() {
    this.logs = await this.firestoreService.obtenerLogs();
    this.Especialidades = await this.firestoreService.obtenerEspecialidades();
    this.EspecialidadesxTurno =
      await this.firestoreService.obtenerTodosLosTurnos();

    let especialistas = await this.firestoreService.obtenerEspecialistas();
    for (const historia of this.EspecialidadesxTurno) {
      historia.Especialista =
        especialistas.find((e) => e.uid === historia.idEspecialista)?.nombre ||
        'Desconocido';
    }
  }
  async createChart() {
    const sortedLogs = this.logs.slice().sort((a, b) => {
      const dateA: any = new Date(
        a.dia.split('/').reverse().join('-') + ' ' + a.hora
      );
      const dateB: any = new Date(
        b.dia.split('/').reverse().join('-') + ' ' + b.hora
      );
      return dateA - dateB;
    });

    const counts: any = {};

    sortedLogs.forEach((log: any) => {
      const key = log.dia;
      counts[key] = (counts[key] || 0) + 1;
    });

    const seriesData: echarts.SeriesOption = {
      name: 'Todos los usuarios',
      type: 'line',
      data: Object.keys(counts).map((day) => counts[day]),
    };

    const xAxisData: string[] = Object.keys(counts);

    this.chartOption1 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const day = params[0].name;
          const logsForDay = sortedLogs.filter((log: any) => log.dia === day);
          let tooltip = `${day}<br/>`;
          logsForDay.forEach((log: any) => {
            tooltip += `${log.usuario} ${log.hora}<br/>`;
          });
          return tooltip;
        },
      },
      legend: {
        data: ['Usuarios'],
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [seriesData],
    } as echarts.EChartsOption;
  }

  async createChart2() {
    // Primero, vamos a contar la cantidad de turnos por cada especialidad
    let conteo = this.Especialidades.map((esp) => {
      let cantidad = this.EspecialidadesxTurno.filter(
        (turno) => turno.idEspecialidad === esp.uid
      ).length;
      return { nombre: esp.nombre, cantidad: cantidad };
    });

    let counts: { [key: string]: number } = {};
    this.Especialidades.forEach((esp: any) => {
      let key = esp.id;
      counts[key] = this.EspecialidadesxTurno.filter(
        (turno) => turno.idEspecialidad === esp.id
      ).length;
    });

    // Preparamos los datos para el gráfico
    let xAxisData = this.Especialidades.map((esp: any) => esp.nombre);
    let seriesData: echarts.SeriesOption[] = [
      {
        name: 'Cantidad de turnos',
        type: 'pictorialBar',
        itemStyle: {
          color: '#f5dd42', // Cambia esto al color que desees
        },
        data: this.Especialidades.map((esp: any) => counts[esp.id]),
      },
    ];

    // Opciones del gráfico
    this.chartOption2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: seriesData,
    };
  }
  async createChart3() {
    // Primero, vamos a contar la cantidad de turnos por cada día
    let counts: { [key: string]: number } = {};
    this.EspecialidadesxTurno.forEach((turno: any) => {
      let key = turno.fecha.split(',')[1].trim(); // Esto extraerá el día (por ejemplo, '18/06/2023')
      counts[key] = (counts[key] || 0) + 1;
    });

    // Ordenamos las fechas
    let orderedDates = Object.keys(counts).sort((a, b) => {
      let dateA = new Date(a.split('/').reverse().join('-'));
      let dateB = new Date(b.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    // Preparamos los datos para el gráfico
    let xAxisData = orderedDates;
    let seriesData: echarts.SeriesOption[] = [
      {
        name: 'Cantidad de turnos',
        type: 'effectScatter',
        itemStyle: {
          color: '#f73619', // Cambia esto al color que desees
        },
        data: orderedDates.map((date) => counts[date]),
      },
    ];

    // Opciones del gráfico
    this.chartOption3 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: seriesData,
    };
  }
  async createChart4() {
    // Filtramos los turnos que están dentro del rango de fechas seleccionado
    let turnosFiltrados = this.EspecialidadesxTurno.filter((turno: any) => {
      let fechaTurno = new Date(
        turno.fecha.split(',')[1].trim().split('/').reverse().join('-')
      );
      let fechaInicio = new Date(this.fechaInicio);
      let fechaFin = new Date(this.fechaFin);
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });
    console.log(turnosFiltrados);

    // Contamos la cantidad de turnos por cada día y médico
    let counts: { [key: string]: number } = {};
    let countsByDoctor: { [key: string]: { [key: string]: number } } = {};
    turnosFiltrados.forEach((turno: any) => {
      let key = `${turno.fecha.split(',')[1].trim()}`;
      let doctorKey = turno.Especialista; // Asume que cada turno tiene un idMedico
      counts[key] = (counts[key] || 0) + 1;
      if (!countsByDoctor[key]) {
        countsByDoctor[key] = {};
      }
      countsByDoctor[key][doctorKey] =
        (countsByDoctor[key][doctorKey] || 0) + 1;
    });
    let sortedKeys = Object.keys(counts).sort((a, b) => {
      return (
        new Date(a.split('/').reverse().join('-')).getTime() -
        new Date(b.split('/').reverse().join('-')).getTime()
      );
    });
    this.chartOption4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const day = params[0].name;
          let tooltip = `${day}<br/>`;
          for (let doctor in countsByDoctor[day]) {
            tooltip += `${doctor}: ${countsByDoctor[day][doctor]}<br/>`;
          }
          return tooltip;
        },
      },
      xAxis: {
        type: 'category',
        data: sortedKeys,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: sortedKeys.map((key) => counts[key]),
          type: 'bar',
          itemStyle: {
            color: '#19f7a2', // Cambia esto al color que desees
          },
        },
      ],
    };
  }
  async createChart5() {
    let turnosFiltrados = this.EspecialidadesxTurno.filter((turno: any) => {
      let fechaTurno = new Date(
        turno.fecha.split(',')[1].trim().split('/').reverse().join('-')
      ).getTime();
      let fechaInicio = new Date(this.fechaInicio2).getTime();
      let fechaFin = new Date(this.fechaFin2).getTime();
      return (
        fechaTurno >= fechaInicio &&
        fechaTurno <= fechaFin &&
        turno.estado === 'finalizado'
      );
    });
    console.log(turnosFiltrados);

    // Contamos la cantidad de turnos por cada día y médico
    let counts: { [key: string]: number } = {};
    let countsByDoctor: { [key: string]: { [key: string]: number } } = {};
    turnosFiltrados.forEach((turno: any) => {
      let key = `${turno.fecha.split(',')[1].trim()}`;
      let doctorKey = turno.Especialista; // Asume que cada turno tiene un idMedico
      counts[key] = (counts[key] || 0) + 1;
      if (!countsByDoctor[key]) {
        countsByDoctor[key] = {};
      }
      countsByDoctor[key][doctorKey] =
        (countsByDoctor[key][doctorKey] || 0) + 1;
    });

    let sortedKeys = Object.keys(counts).sort((a, b) => {
      return (
        new Date(a.split('/').reverse().join('-')).getTime() -
        new Date(b.split('/').reverse().join('-')).getTime()
      );
    });

    this.chartOption5 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const day = params[0].name;
          let tooltip = `${day}<br/>`;
          for (let doctor in countsByDoctor[day]) {
            tooltip += `${doctor}: ${countsByDoctor[day][doctor]}<br/>`;
          }
          return tooltip;
        },
      },
      xAxis: {
        type: 'category',
        data: sortedKeys,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: sortedKeys.map((key) => counts[key]),
          type: 'bar',
          itemStyle: {
            color: '#eb2f96', // Cambia esto al color que desees
          },
        },
      ],
    };
  }
}
