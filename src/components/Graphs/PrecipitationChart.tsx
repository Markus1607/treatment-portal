import 'utils/imports/am5-chart-license';
import * as am5 from '@amcharts/amcharts5/index';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useRef, useEffect, useLayoutEffect } from 'react';

type PrecipitationChartPropType = {
  data: object[];
  graphId: string;
};

export default function PrecipitationChart({
  data,
  graphId,
}: PrecipitationChartPropType) {
  const rootRef = useRef<am5.Root>();
  const chartRef = useRef<am5xy.XYChart>();
  const seriesRef = useRef<am5xy.ColumnSeries>();

  useLayoutEffect(() => {
    const root = am5.Root.new(graphId);
    root.utc = true;
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
      fontSize: '0.8em',
      fontWeight: '300',
      fontFamily: 'Rubik',
      fill: am5.color(0x89959f),
      dx: -10,
      dy: 20,
      paddingBottom: 20,
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

    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 32,
    });
    yRenderer.labels.template.setAll({
      visible: false,
    });
    yRenderer.grid.template.setAll({
      visible: false,
    });

    const yAxis = tempChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        numberFormat: "#'%'",
        min: 0,
        max: 100,
      })
    );

    for (let i = 0; i < 5; ++i) {
      const dataItem = yAxis.makeDataItem({
        value: i * 25,
      });
      yAxis.createAxisRange(dataItem);
      dataItem.get('label')?.setAll({
        text: `${i * 25}%`,
        fontSize: '0.8em',
        fontWeight: '300',
        fontFamily: 'Rubik',
        fill: am5.color(0x89959f),
        visible: true, //override the axis-level setting
      });
      dataItem.get('grid')?.setAll({
        strokeDasharray: [10],
        visible: true, //override the axis-level setting
      });
    }

    const tooltip = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      labelText: '🔵 {valueY}%',
    });
    tooltip.label.setAll({
      fontSize: '0.8em',
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
      am5xy.ColumnSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'precipitation',
        valueXField: 'date',
        tooltip: tooltip,
      })
    );
    series.columns.template.setAll({
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          {
            color: am5.color(0x4da0e6),
            opacity: 0.7,
          },
          {
            color: am5.color(0x7db5e5),
            opacity: 0.7,
          },
        ],
        rotation: 90,
      }),
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      stroke: am5.color(0xffffff),
    });

    chartRef.current = tempChart;
    seriesRef.current = series;
    rootRef.current = root;
    return () => {
      rootRef.current && rootRef.current.dispose();
      chartRef.current && chartRef.current.dispose();
    };
  }, [graphId]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(data);
    }
  }, [data]);

  return <div id={graphId} className='h-[190px] 2xl:h-[200px] w-full' />;
}
