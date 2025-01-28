import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect, useLayoutEffect } from 'react';

type ExpectedSolarRadiationChartPropType = {
  data: object[];
  graphId: string;
  hideWithoutSunscreen: boolean;
};

export default function ExpectedSolarRadiationChart({
  data,
  graphId,
  hideWithoutSunscreen,
}: ExpectedSolarRadiationChartPropType) {
  const rootRef = useRef<am5.Root>();
  const chartRef = useRef<am5xy.XYChart>();
  const seriesRef = useRef<am5xy.ColumnSeries>();
  const series2Ref = useRef<am5xy.ColumnSeries>();
  const cursorRef = useRef<am5xy.XYCursor>();

  useLayoutEffect(() => {
    const root = am5.Root.new(graphId);
    root.utc = true;

    const tempChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        maxTooltipDistance: 0,
      })
    );
    tempChart.zoomOutButton.set('forceHidden', true);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    });
    xRenderer.labels.template.setAll({
      rotation: -45,
      fontSize: '0.9em',
      dy: 0,
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
      fontSize: '0.9em',
      fill: am5.color(0x89959f),
    });
    yRenderer.grid.template.setAll({
      strokeDasharray: [10],
    });

    const yAxis = tempChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        numberFormat: "#'%'",
      })
    );

    const series = tempChart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: hideWithoutSunscreen
          ? 'erythemalDoseSunscreen'
          : 'erythemalDose',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    series.columns.template.setAll({
      opacity: 0.7,
      fill: hideWithoutSunscreen ? am5.color(0xf2971b) : am5.color(0xfacd68),
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      stroke: am5.color(0xffffff),
      width: am5.percent(100),
      tooltipY: 0,
    });

    const tooltip = series.getTooltip();

    tooltip?.setAll({
      getFillFromSprite: false,
      labelText: hideWithoutSunscreen ? '🟠 {valueY}%' : '🟡 {valueY}%',
    });

    tooltip?.label.setAll({
      fontSize: '0.8em',
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });

    tooltip?.get('background')?.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 1,
      stroke: am5.color(0xd9e4ee),
      strokeWidth: 0.5,
      shadowColor: am5.color(0xd9e4ee),
      shadowBlur: 10,
      shadowOffsetY: 4,
    });

    const series2 = tempChart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: hideWithoutSunscreen ? 'ppixDoseSunscreen' : 'ppixDose',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    series2.columns.template.setAll({
      opacity: 0.7,
      fill: hideWithoutSunscreen ? am5.color(0x4da0e6) : am5.color(0xdaecfa),
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      stroke: am5.color(0xffffff),
      width: am5.percent(100),
      tooltipY: 0,
    });

    const tooltip2 = series2.getTooltip();

    tooltip2?.setAll({
      getFillFromSprite: false,
      labelText: '🔵 {valueY}%',
    });

    tooltip2?.label.setAll({
      fontSize: '0.8em',
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
    });

    tooltip2?.get('background')?.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 1,
      stroke: am5.color(0xd9e4ee),
      strokeWidth: 0.5,
      shadowColor: am5.color(0xd9e4ee),
      shadowBlur: 10,
      shadowOffsetY: 4,
    });

    const cursor = tempChart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);
    cursor.lineX.setAll({
      strokeDasharray: [10],
      stroke: am5.color(0x89959f),
    });

    rootRef.current = root;
    cursorRef.current = cursor;
    seriesRef.current = series;
    chartRef.current = tempChart;
    series2Ref.current = series2;

    return () => {
      rootRef.current && rootRef.current.dispose();
      chartRef.current && chartRef.current.dispose();
    };
  }, [graphId, hideWithoutSunscreen]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
    }
    if (series2Ref.current) {
      series2Ref.current.data.setAll(data);
    }
    if (cursorRef.current && seriesRef.current && series2Ref.current) {
      cursorRef.current.setAll({
        snapToSeries: [seriesRef.current, series2Ref.current],
        snapToSeriesBy: 'x',
      });
    }
  }, [data]);

  return <div id={graphId} className='h-[190px] 2xl:h-[200px] w-full' />;
}
