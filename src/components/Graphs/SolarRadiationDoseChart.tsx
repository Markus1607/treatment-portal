import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect, useLayoutEffect } from 'react';

type SolarRadiationDoseChartPropType = {
  data: object[];
  graphId: string;
  hideWithoutSunscreen: boolean;
};

export default function SolarRadiationDoseChart({
  data,
  graphId,
  hideWithoutSunscreen,
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
      visible: false,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'name',
        renderer: yRenderer,
      })
    );
    yAxis.data.setAll(data);
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 120,
    });
    xRenderer.labels.template.setAll({
      fontSize: '0.9em',
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    xRenderer.grid.template.setAll({
      strokeDasharray: [8],
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        numberFormat: "#'%'",
        renderer: xRenderer,
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        baseAxis: yAxis,
        valueXField: 'percentage',
        sequencedInterpolation: false,
        categoryYField: 'name',
        maskBullets: false,
      })
    );
    series.bullets.push(function (root, _, dataItem) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: '{value} {unit}',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dx: dataItem?.dataContext?.value < 30 ? 35 : 5,
          fontSize: '1em',
          fontFamily: 'Rubik',
          fill: am5.color(0x000000),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          populateText: true,
        }),
      });
    });

    series.columns.template.setAll({
      opacity: 0.7,
      strokeOpacity: 0.7,
      height: 75,
    });
    chart
      .get('colors')
      ?.set(
        'colors',
        hideWithoutSunscreen
          ? [am5.color(0xf2971b), am5.color(0x4da0e6)]
          : [am5.color(0xfacd68), am5.color(0xdaecfa)]
      );
    series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });
    series.columns.template.adapters.add('fill', (_, target) => {
      return chart.get('colors')?.getIndex(series.columns.indexOf(target));
    });
    series.columns.template.adapters.add('stroke', (_, target) => {
      return chart.get('colors')?.getIndex(series.columns.indexOf(target));
    });

    chartRef.current = chart;
    seriesRef.current = series;
    rootRef.current = root;

    return () => {
      chartRef.current && chartRef.current.dispose();
      rootRef.current && rootRef.current.dispose();
    };
  }, [data, hideWithoutSunscreen, graphId]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
    }
  }, [data]);

  return <div id={graphId} className='h-[250px] w-full max-w-xl' />;
}
