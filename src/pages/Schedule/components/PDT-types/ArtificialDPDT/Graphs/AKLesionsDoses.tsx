import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect, useLayoutEffect } from 'react';

type SolarRadiationDoseChartPropType = {
  data: object[];
  graphId: string;
};

export default function AKLesionDoses({
  data,
  graphId,
}: SolarRadiationDoseChartPropType) {
  const rootRef = useRef<am5.Root>();
  const chartRef = useRef<am5xy.XYChart>();
  const seriesRef = useRef<am5xy.ColumnSeries>();

  useLayoutEffect(() => {
    const root = am5.Root.new(graphId);
    root.numberFormatter.set('numberFormat', '.0');

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
      })
    );

    chart.zoomOutButton.set('forceHidden', true);

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.setAll({
      strokeWidth: 0,
      stroke: am5.color(0xffffff),
    });
    yRenderer.grid.template.setAll({
      strokeWidth: 0,
      stroke: am5.color(0xffffff),
    });
    yRenderer.labels.template.setAll({
      opacity: 0.7,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        extraTooltipPrecision: 1,
        min: 0,
        max: 100,
        renderer: yRenderer,
        numberFormat: "#'%'",
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 40,
    });
    xRenderer.labels.template.setAll({
      fontSize: '0.9em',
      fontWeight: '400',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    xRenderer.grid.template.setAll({
      strokeDasharray: [8],
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'name',
        renderer: xRenderer,
      })
    );
    xAxis.data.setAll(data);

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        baseAxis: xAxis,
        valueYField: 'percentage',
        categoryXField: 'name',
      })
    );
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 0.5,
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: '{value} {unit}',
          dy: -8,
          fontSize: '0.9em',
          fontFamily: 'Rubik',
          fill: am5.color(0x696f83),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          populateText: true,
        }),
      });
    });

    series.columns.template.setAll({
      opacity: 0.7,
      strokeOpacity: 0.7,
      width: am5.percent(30),
    });

    chart.get('colors')?.set('colors', [am5.color(0xfacd68)]);
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });

    chartRef.current = chart;
    seriesRef.current = series;
    rootRef.current = root;

    return () => {
      chartRef.current && chartRef.current.dispose();
      rootRef.current && rootRef.current.dispose();
    };
  }, [data, graphId]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
    }
  }, [data]);

  return <div id={graphId} className='h-[250px] w-full' />;
}
