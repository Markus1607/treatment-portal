import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect, useLayoutEffect } from 'react';

type TempChartPropType = {
  data: object[];
  height?: number;
  graphId: string;
};

export default function TempChart({
  data,
  height,
  graphId,
}: TempChartPropType) {
  const rootRef = useRef<am5.Root>();
  const chartRef = useRef<am5xy.XYChart>();
  const seriesRef = useRef<am5xy.SmoothedXLineSeries>();
  const valueAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer>>();

  useLayoutEffect(() => {
    const fontSize = height === 300 ? '0.5em' : '0.8em';
    const root = am5.Root.new(graphId);
    root.utc = true;
    root.numberFormatter.set('numberFormat', '.0');
    const tempChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
      })
    );
    tempChart.zoomOutButton.set('forceHidden', true);
    const cursor = tempChart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.setAll({
      strokeDasharray: [10],
      stroke: am5.color(0x89959f),
    });

    const xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.labels.template.setAll({
      rotation: -45,
      fontSize: fontSize,
      dx: -10,
      dy: 20,
      paddingBottom: 20,
      fill: am5.color(0x89959f),
    });
    xRenderer.grid.template.setAll({
      strokeWidth: 0,
      stroke: am5.color(0xffffff),
    });

    const xAxis = tempChart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        startLocation: 0.25,
        endLocation: 0.75,
        baseInterval: {
          timeUnit: 'hour',
          count: 1,
        },
        gridIntervals: [{ timeUnit: 'hour', count: 1 }],
        markUnitChange: false,
        renderer: xRenderer,
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.setAll({
      fontSize: fontSize,
      fill: am5.color(0x89959f),
    });
    yRenderer.grid.template.setAll({
      strokeDasharray: [10],
    });

    const yAxis = tempChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
      })
    );

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: '🟠 {valueY} ºC',
    });
    tooltip.label.setAll({
      fontSize: fontSize,
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    tooltip.get('background')?.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 1,
      stroke: am5.color(0xd9e4ee),
      strokeWidth: 0.5,
      shadowColor: am5.color(0xd9e4ee),
      shadowBlur: 10,
      shadowOffsetY: 4,
    });

    const series = tempChart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Temperature',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'temperature',
        valueXField: 'date',
        fill: am5.color(0xf2971b),
        stroke: am5.color(0xf2971b),
        tooltip: tooltip,
      })
    );
    series.strokes.template.setAll({
      strokeWidth: 2,
    });
    series.fills.template.setAll({
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          {
            color: am5.color(0xf2971b),
            opacity: 0.5,
          },
          {
            color: am5.color(0xd6b88d),
            opacity: 0.1,
          },
        ],
        rotation: 90,
      }),
    });

    rootRef.current = root;
    seriesRef.current = series;
    chartRef.current = tempChart;
    valueAxisRef.current = yAxis;

    return () => {
      rootRef.current && rootRef.current.dispose();
      chartRef.current && chartRef.current.dispose();
    };
  }, [height, graphId]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
      valueAxisRef.current?.zoom(0, 1);
    }
  }, [data]);

  return (
    <div
      id={graphId}
      className={
        height === 300 ? 'h-[300px] w-full' : 'h-[190px] 2xl:h-[200px] w-full'
      }
    />
  );
}
