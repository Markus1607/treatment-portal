import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect } from 'react';

type AccumulatedSolarDosesChartPropType = {
  data: object[];
  height?: number;
  graphId: string;
  leftYAxisLabel: string;
  rightYAxisLabel: string;
};

export default function AccumulatedSolarDosesChart({
  data,
  height,
  graphId,
  leftYAxisLabel,
  rightYAxisLabel,
}: AccumulatedSolarDosesChartPropType) {
  const rootRef = useRef<am5.Root>();
  const chartRef = useRef<am5xy.XYChart>();
  const seriesRef = useRef<am5xy.SmoothedXLineSeries>();
  const series2Ref = useRef<am5xy.SmoothedXLineSeries>();
  const valueAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer>>();

  useEffect(() => {
    const root = am5.Root.new(graphId);
    const solarChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingBottom: 0,
        marginBottom: 0,
      })
    );
    solarChart.zoomOutButton.set('forceHidden', true);
    const cursor = solarChart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.setAll({
      strokeDasharray: [10],
      stroke: am5.color(0x89959f),
    });

    const xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.labels.template.setAll({
      rotation: -45,
      fontFamily: 'Rubik',
      fontSize: '0.8em',
      fill: am5.color(0x89959f),
      fontWeight: '300',
      dx: -10,
      dy: 20,
      paddingBottom: 20,
      paddingRight: 10,
    });
    xRenderer.grid.template.setAll({
      strokeWidth: 0,
      location: 0,
      stroke: am5.color(0xffffff),
    });
    const xAxis = solarChart.xAxes.push(
      am5xy.DateAxis.new(root, {
        startLocation: 0.5,
        endLocation: 0.5,
        maxDeviation: 0.1,
        baseInterval: {
          timeUnit: 'minute',
          count: 1,
        },
        markUnitChange: false,
        renderer: xRenderer,
        start: 0,
        end: 1,
      })
    );
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    const yRenderer2 = am5xy.AxisRendererY.new(root, {
      opposite: true,
    });
    yRenderer.labels.template.setAll({
      fontWeight: '300',
      fontSize: '0.8em',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    yRenderer.grid.template.setAll({
      strokeDasharray: [10],
    });
    yRenderer2.labels.template.setAll({
      fontWeight: '300',
      fontSize: '0.8em',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    yRenderer2.grid.template.setAll({
      strokeDasharray: [10],
    });

    const yAxis = solarChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        extraMax: 0.25,
        strictMinMax: true,
        renderer: yRenderer,
        min: 0,
      })
    );
    yAxis.children.unshift(
      am5.Label.new(root, {
        rotation: -90,
        text: leftYAxisLabel,
        y: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0x3e85c1),
      })
    );

    const yAxis2 = solarChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        min: 0,
        renderer: yRenderer2,
      })
    );
    yAxis2.children.push(
      am5.Label.new(root, {
        rotation: -90,
        text: rightYAxisLabel,
        y: am5.p50,
        centerX: am5.p50,
        fill: am5.color(0xf2971b),
      })
    );
    yAxis.set('syncWithAxis', yAxis2);

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: '🔵 {valueY} J/cm²',
    });
    tooltip.label.setAll({
      fontSize: '0.75em',
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

    const series = solarChart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'ppix',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'irr_ppix',
        valueXField: 'date',
        stroke: am5.color(0x3e85c1),
        tooltip: tooltip,
        snapTooltip: true,
        interpolationDuration: 0,
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
            color: am5.color(0x41a6fc),
            opacity: 0.5,
          },
          {
            color: am5.color(0x3d84bf),
            opacity: 0.1,
          },
        ],
        rotation: 90,
      }),
    });

    const tooltip2 = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: '🟠 {valueY} J/m²',
    });
    tooltip2.label.setAll({
      fontSize: '0.75em',
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });
    tooltip2.get('background')?.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 1,
      stroke: am5.color(0xd9e4ee),
      strokeWidth: 0.5,
      shadowColor: am5.color(0xd9e4ee),
      shadowBlur: 10,
      shadowOffsetY: 4,
    });

    const series2 = solarChart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'irr_ery',
        xAxis: xAxis,
        yAxis: yAxis2,
        valueYField: 'irr_ery',
        valueXField: 'date',
        fill: am5.color(0xf2971b),
        stroke: am5.color(0xf2971b),
        tooltip: tooltip2,
        snapTooltip: true,
        interpolationDuration: 0,
      })
    );
    series2.strokes.template.setAll({
      strokeWidth: 2,
    });
    series2.fills.template.setAll({
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
    series2Ref.current = series2;
    valueAxisRef.current = yAxis;
    chartRef.current = solarChart;

    return () => {
      rootRef.current && rootRef.current.dispose();
      seriesRef.current && seriesRef.current.dispose();
      series2Ref.current && series2Ref.current.dispose();
    };
  }, [height, graphId, leftYAxisLabel, rightYAxisLabel]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
    }
    if (series2Ref.current) {
      series2Ref.current.data.setAll(data);
    }
  }, [data]);

  return (
    <div
      id={graphId}
      className={
        height === 300
          ? 'h-[300px] w-[99.9%] mx-auto'
          : 'h-[190px] 2xl:h-[200px] w-full'
      }
    />
  );
}
