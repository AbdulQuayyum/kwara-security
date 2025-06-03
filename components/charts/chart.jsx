// BarChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart as ChartKitBarChart } from 'react-native-chart-kit';
import { fonts } from '../../assets/fonts';

const windowWidth = Dimensions.get('window').width;

const BarChart = ({ data, title, xAxisLabel, yAxisLabel, color = '#2563EB', height = 300 }) => {
    // Transform data for Chart Kit format
    const chartData = {
        labels: data.map(item => item.x),
        datasets: [{
            data: data.map(item => item.y),
            colors: data.map(item => () => item.color || color) // Optional: custom colors per bar
        }]
    };

    const needsScroll = data.length > 5;
    const chartWidth = needsScroll ? Math.max(data.length * 60, windowWidth * 0.9) : windowWidth * 0.9;

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#f8fafc',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: '#e5e7eb',
            strokeDasharray: '0',
        },
        propsForLabels: {
            fontFamily: fonts.light,
            fontSize: 12,
        },
        barPercentage: 0.7,
        fillShadowGradient: color,
        fillShadowGradientOpacity: 0.8,
    };

    const Chart = (
        <View style={styles.chartWrapper}>
            <ChartKitBarChart
                data={chartData}
                width={chartWidth}
                height={height - 60}
                chartConfig={chartConfig}
                verticalLabelRotation={data.length > 5 ? 30 : 0}
                showValuesOnTopOfBars={true}
                fromZero={true}
                style={styles.chart}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {needsScroll ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: windowWidth * 0.9 }}>
                    {Chart}
                </ScrollView>
            ) : (
                Chart
            )}
            {(xAxisLabel || yAxisLabel) && (
                <View style={styles.axisLabels}>
                    {yAxisLabel && <Text style={styles.yAxisLabel}>{yAxisLabel}</Text>}
                    {xAxisLabel && <Text style={styles.xAxisLabel}>{xAxisLabel}</Text>}
                </View>
            )}
        </View>
    );
};

// LineChart.js
import { LineChart as ChartKitLineChart } from 'react-native-chart-kit';

const LineChart = ({
    data,
    title,
    xAxisLabel,
    yAxisLabel,
    color = '#2563EB',
    showArea = false,
    showPoints = true,
    height = 250,
    bezier = true
}) => {
    const chartData = {
        labels: data.map(item => item.x),
        datasets: [{
            data: data.map(item => item.y),
            strokeWidth: 3,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        }]
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#f8fafc',
        decimalPlaces: 0,
        color: (opacity = 1) => color.includes('rgb') ? color.replace('rgb', 'rgba').replace(')', `, ${opacity})`) : `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: '#e5e7eb',
            strokeDasharray: '0',
        },
        propsForLabels: {
            fontFamily: fonts.light,
            fontSize: 12,
        },
        propsForDots: {
            r: showPoints ? '6' : '0',
            strokeWidth: '2',
            stroke: color,
            fill: '#ffffff'
        },
        fillShadowGradient: showArea ? color : 'transparent',
        fillShadowGradientOpacity: showArea ? 0.2 : 0,
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <ChartKitLineChart
                data={chartData}
                width={Math.min(450, windowWidth * 0.9)}
                height={height}
                chartConfig={chartConfig}
                bezier={bezier}
                style={styles.chart}
                verticalLabelRotation={data.length > 6 ? 30 : 0}
            />
            {(xAxisLabel || yAxisLabel) && (
                <View style={styles.axisLabels}>
                    {yAxisLabel && <Text style={styles.yAxisLabel}>{yAxisLabel}</Text>}
                    {xAxisLabel && <Text style={styles.xAxisLabel}>{xAxisLabel}</Text>}
                </View>
            )}
        </View>
    );
};

// MultiLineChart.js
const MultiLineChart = ({ series, title, xAxisLabel, yAxisLabel, height = 300 }) => {
    // Combine all unique x values
    const allLabels = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];

    const chartData = {
        labels: allLabels,
        datasets: series.map(s => ({
            data: allLabels.map(label => {
                const point = s.data.find(d => d.x === label);
                return point ? point.y : 0;
            }),
            color: (opacity = 1) => s.color.includes('rgb') ?
                s.color.replace('rgb', 'rgba').replace(')', `, ${opacity})`) :
                `${s.color}${Math.round(opacity * 255).toString(16)}`,
            strokeWidth: 3,
        })),
        legend: series.map(s => s.name)
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#f8fafc',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: '#e5e7eb',
            strokeDasharray: '0',
        },
        propsForLabels: {
            fontFamily: fonts.light,
            fontSize: 12,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ffffff'
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <ChartKitLineChart
                data={chartData}
                width={Math.min(450, windowWidth * 0.9)}
                height={height}
                chartConfig={chartConfig}
                bezier={true}
                style={styles.chart}
                verticalLabelRotation={allLabels.length > 6 ? 30 : 0}
            />
            {(xAxisLabel || yAxisLabel) && (
                <View style={styles.axisLabels}>
                    {yAxisLabel && <Text style={styles.yAxisLabel}>{yAxisLabel}</Text>}
                    {xAxisLabel && <Text style={styles.xAxisLabel}>{xAxisLabel}</Text>}
                </View>
            )}
        </View>
    );
};

// PieChart.js
import { PieChart as ChartKitPieChart } from 'react-native-chart-kit';

const PieChart = ({ data, title, height = 250, showLegend = true }) => {
    const total = data.reduce((acc, item) => acc + item.y, 0);

    // Transform data for Chart Kit format
    const chartData = data.map((item, index) => ({
        name: item.x,
        population: item.y,
        color: item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`,
        legendFontColor: '#374151',
        legendFontSize: 12,
        legendFontFamily: fonts.light,
    }));

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForLabels: {
            fontFamily: fonts.light,
            fontSize: 12,
        },
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.chartContainer}>
                <ChartKitPieChart
                    data={chartData}
                    width={Math.min(350, windowWidth * 0.9)}
                    height={height}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 10]}
                    absolute={false} // Show percentages instead of absolute values
                    hasLegend={showLegend}
                    style={styles.chart}
                />
            </View>
        </View>
    );
};

// ProgressChart.js (Custom since Chart Kit doesn't have progress charts)
import Svg, { Circle } from 'react-native-svg';

const ProgressChart = ({ value, maxValue, title, color = '#2563EB', size = 120 }) => {
    const percentage = Math.min(100, Math.round((value / maxValue) * 100));
    const radius = (size - 20) / 2;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>{title}</Text>
            <View style={styles.progressChartContainer}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        stroke="#E5E7EB"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress circle with gradient effect */}
                    <Circle
                        stroke={color}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={size / 2}
                        cy={size / 2}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        opacity={0.9}
                    />
                </Svg>
                <View style={styles.progressValueContainer}>
                    <Text style={styles.progressValueText}>{percentage}%</Text>
                </View>
            </View>
            <Text style={styles.progressSubtitle}>{value} of {maxValue}</Text>
        </View>
    );
};

// DonutChart.js (Bonus chart type)
const DonutChart = ({ data, title, height = 220 }) => {
    const total = data.reduce((acc, item) => acc + item.y, 0);

    const chartData = data.map((item, index) => ({
        name: item.x,
        population: item.y,
        color: item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`,
        legendFontColor: '#374151',
        legendFontSize: 12,
        legendFontFamily: fonts.light,
    }));

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.chartContainer}>
                <ChartKitPieChart
                    data={chartData}
                    width={Math.min(300, windowWidth * 0.8)}
                    height={height}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute={false}
                    hasLegend={true}
                    style={styles.chart}
                />
                {/* Center text showing total */}
                <View style={styles.donutCenter}>
                    <Text style={styles.donutTotal}>{total}</Text>
                    <Text style={styles.donutLabel}>Total</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontFamily: fonts.semibold,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: '#1F2937',
    },
    chartWrapper: {
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 8,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    axisLabels: {
        marginTop: 10,
        alignItems: 'center',
    },
    xAxisLabel: {
        fontFamily: fonts.medium,
        fontSize: 12,
        color: '#6B7280',
        marginTop: 5,
    },
    yAxisLabel: {
        fontFamily: fonts.medium,
        fontSize: 12,
        color: '#6B7280',
        transform: [{ rotate: '-90deg' }],
        position: 'absolute',
        left: -30,
        top: '50%',
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: windowWidth > 500 ? 150 : windowWidth / 3 - 20,
    },
    progressTitle: {
        fontFamily: fonts.medium,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
        color: '#4B5563',
    },
    progressChartContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressValueContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressValueText: {
        fontFamily: fonts.semibold,
        fontSize: 16,
        color: '#1F2937',
    },
    progressSubtitle: {
        fontFamily: fonts.light,
        fontSize: 12,
        color: '#6B7280',
        marginTop: 5,
        textAlign: 'center',
    },
    donutCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '35%',
    },
    donutTotal: {
        fontFamily: fonts.bold,
        fontSize: 24,
        color: '#1F2937',
    },
    donutLabel: {
        fontFamily: fonts.light,
        fontSize: 12,
        color: '#6B7280',
    },
});

export { BarChart, LineChart, MultiLineChart, PieChart, ProgressChart, DonutChart };