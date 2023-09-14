import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, CardHeader, Box, IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// components
import { CustomSmallSelect } from '../../../../components/custom-input';
import Chart, { useChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const selectOptions = ['Year', 'Month', 'Week', 'Date']

function createPercentageIncrease(data, period) {
  var percentageIncrease = [];
  var preTotal = 0;
  for (let i in data) {
    var currTotal = 0;
    for (let j in data[i].series[0].data) {
      currTotal += data[i].series[0].data[j];
    }
    if (currTotal > preTotal) {
      var inc;
      if (preTotal === 0) {
        inc = "∞";
      } else {
        inc = parseInt(((currTotal - preTotal) * 100) / preTotal);
      }
      percentageIncrease.push(inc + "% increase than last " + period);
    } else if (currTotal < preTotal) {
      const inc = parseInt(((preTotal - currTotal) * 100) / preTotal);
      percentageIncrease.push(inc + "% decrease than last " + period);
    } else {
      percentageIncrease.push("0% increase than last " + period);
    }
    preTotal = currTotal
  }
  return percentageIncrease;
}

function getSeriesQuestionCount(questionCount) {
  var week = 0;
  var seriesQuestionCount = []
  for (let key in questionCount) {
    for (let j in questionCount[key]) {
      for (let k in questionCount[key][j]) {
        seriesQuestionCount.push(
          {
            value: questionCount[key][j][k],
            week: week,
            date: parseInt(k) + 1,
            month: parseInt(j) + 1,
            year: key
          }
        )
        week = (week + 1) % 7;
      }
    }
  }
  return seriesQuestionCount;
}

function createYearWiseData(questionCount) {
  const labelGroup = ["2021-2030"];
  const categories = ["2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
  var series = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var presentIndex = 0;
  for (let key in questionCount) {
    var cnt = 0;
    for (let j in questionCount[key]) {
      for (let k in questionCount[key][j]) {
        cnt += questionCount[key][j][k];
      }
    }
    const index = categories.indexOf(key);
    series[index] = cnt;
  }

  const data = [
    {
      categories: categories,
      series: [{ name: "Created Question", data: series }]
    }
  ];

  const ans = {
    labelGroup: labelGroup,
    data: data,
    presentIndex: presentIndex,
    percentageIncrease: createPercentageIncrease(data, 'decade'),
  }
  return ans;
}

function createMonthWiseData(questionCount) {
  var labelGroup = [];
  var data = [];
  var presentIndex = 0;
  const date = new Date();
  for (let key in questionCount) {
    labelGroup.push(key);
    const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var series = [];
    for (let j in questionCount[key]) {
      var cnt = 0;
      for (let k in questionCount[key][j]) {
        cnt += questionCount[key][j][k];
      }
      series.push(cnt);
    }
    if (parseInt(key) === date.getFullYear()) {
      presentIndex = labelGroup.length - 1;
    }
    data.push({ categories: categories, series: [{ name: "Created Question", data: series }] })
  }
  const ans = {
    labelGroup: labelGroup,
    data: data,
    presentIndex: presentIndex,
    percentageIncrease: createPercentageIncrease(data, 'year'),
  }
  return ans;
}

function createWeekWiseData(questionCount) {
  const seriesQuestionCount = getSeriesQuestionCount(questionCount);
  var currQs = 0;
  var weekSeriesQuestion = [];
  var startWeek = 0;
  var startDate = 1;
  var startMonth = 1;
  var startYear = "2023";
  var endWeek = 0;
  var endDate = 1;
  var endMonth = 1;
  var endYear = "2023";
  for (let i in seriesQuestionCount) {
    if (parseInt(i) !== 0 && seriesQuestionCount[i].week === 0) {
      weekSeriesQuestion.push(
        {
          value: currQs,
          startWeek: startWeek,
          startDate: startDate,
          startMonth: startMonth,
          startYear: startYear,
          endWeek: endWeek,
          endDate: endDate,
          endMonth: endMonth,
          endYear: endYear,
        }
      )
      currQs = 0;
      startWeek = seriesQuestionCount[i].week;
      startDate = seriesQuestionCount[i].date;
      startMonth = seriesQuestionCount[i].month;
      startYear = seriesQuestionCount[i].year;
    }
    currQs += seriesQuestionCount[i].value;
    endWeek = seriesQuestionCount[i].week;
    endDate = seriesQuestionCount[i].date;
    endMonth = seriesQuestionCount[i].month;
    endYear = seriesQuestionCount[i].year;
  }

  weekSeriesQuestion.push(
    {
      value: currQs,
      startWeek: startWeek,
      startDate: startDate,
      startMonth: startMonth,
      startYear: startYear,
      endWeek: endWeek,
      endDate: endDate,
      endMonth: endMonth,
      endYear: endYear,
    }
  )

  var presentIndex = 0;
  const date = new Date();
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var labelGroup = [];
  var data = [];
  var i = 0;
  while (i < weekSeriesQuestion.length) {
    var changeMonthIndex = 0;
    var lastMonth = -1;
    var categories = [];
    var series = [];
    var j = 0;
    var finish = false;
    labelGroup.push(month[weekSeriesQuestion[i + j].endMonth - 1] + ' ' + weekSeriesQuestion[i + j].endYear);
    if (date.getFullYear() === parseInt(weekSeriesQuestion[i + j].endYear) && date.getMonth() === weekSeriesQuestion[i + j].endMonth - 1) {
      presentIndex = labelGroup.length - 1;
    }
    while (j < 6) {
      if (i + j < weekSeriesQuestion.length) {
        series.push(weekSeriesQuestion[i + j].value);
        categories.push(weekSeriesQuestion[i + j].startDate + '-' + weekSeriesQuestion[i + j].endDate)

        if (lastMonth !== weekSeriesQuestion[i + j].startMonth || weekSeriesQuestion[i + j].endMonth !== weekSeriesQuestion[i + j].startMonth) {
          changeMonthIndex = i + j;
        }
        lastMonth = weekSeriesQuestion[i + j].endMonth;
        j++;
      } else {
        finish = true;
        break;
      }
    }
    data.push({ categories: categories, series: [{ name: "Created Question", data: series }] })
    if (i === changeMonthIndex) break;
    i = changeMonthIndex;
    if (finish) break;
  }

  const ans = {
    labelGroup: labelGroup,
    data: data,
    presentIndex: presentIndex,
    percentageIncrease: createPercentageIncrease(data, 'month'),
  }

  return ans;
}

function createDateWiseData(questionCount) {
  const seriesQuestionCount = getSeriesQuestionCount(questionCount);
  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var labelGroup = [];
  var data = [];
  var categories = [];
  var series = [];
  var startDate = 1;
  var startMonth = 1;
  var startYear = "2023";
  var endDate = 1;
  var endMonth = 1;
  var endYear = "2023";
  var presentIndex = 0;
  const date = new Date();
  for (let i in seriesQuestionCount) {
    if (date.getFullYear() === parseInt(seriesQuestionCount[i].year) && date.getMonth() === seriesQuestionCount[i].month - 1) {
      presentIndex = labelGroup.length - 2;
    }
    if (seriesQuestionCount[i].week === 0) {
      if (categories.length !== 0) {
        data.push({ categories: categories, series: [{ name: "Created Question", data: series }] });
        labelGroup.push(startDate + ' ' + month[startMonth - 1] + ' ' + startYear + ' - ' + endDate + ' ' + month[endMonth - 1] + ' ' + endYear)
      }
      categories = [];
      series = [];
      startDate = seriesQuestionCount[i].date;
      startMonth = seriesQuestionCount[i].month;
      startYear = seriesQuestionCount[i].year;
    }
    categories.push(week[seriesQuestionCount[i].week] + ', ' + seriesQuestionCount[i].date + ' ' + month[seriesQuestionCount[i].month - 1]);
    series.push(seriesQuestionCount[i].value);
    endDate = seriesQuestionCount[i].date;
    endMonth = seriesQuestionCount[i].month;
    endYear = seriesQuestionCount[i].year;
  }

  if (categories.length !== 0) {
    data.push({ categories: categories, series: [{ name: "Created Question", data: series }] });
    labelGroup.push(startDate + ' ' + month[startMonth - 1] + ' ' + startYear + ' - ' + endDate + ' ' + month[endMonth - 1] + ' ' + endYear)
  }

  const ans = {
    labelGroup: labelGroup,
    data: data,
    presentIndex: presentIndex,
    percentageIncrease: createPercentageIncrease(data, 'week'),
  }

  return ans;
}

QuestionTypedChart.propTypes = {
  questionCount: PropTypes.object,
  title: PropTypes.string,
};

export default function QuestionTypedChart({ title, questionCount, chart, ...other }) {

  const yearWise = createYearWiseData(questionCount);
  const monthWise = createMonthWiseData(questionCount);
  const weekWise = createWeekWiseData(questionCount);
  const dateWise = createDateWiseData(questionCount);

  const [currOptions, setCurrOptions] = useState('Date');
  const [currSubHeader, setCurrSubHeader] = useState(dateWise?.percentageIncrease[dateWise?.presentIndex]);
  const [currIndex, setCurrIndex] = useState(dateWise?.presentIndex);
  const [currLebel, setCurrLebel] = useState(dateWise?.labelGroup[dateWise?.presentIndex]);
  const [seriesData, setSeriesData] = useState(dateWise?.data[dateWise?.presentIndex]?.series);
  const [categories, setCategories] = useState(dateWise?.data[dateWise?.presentIndex]?.categories);
  const [disableLeft, setDisableLeft] = useState(dateWise?.presentIndex - 1 < 0);
  const [disableRight, setDisableRight] = useState(dateWise?.presentIndex + 1 >= dateWise?.labelGroup?.length);

  const chartOptions = useChart({
    xaxis: {
      categories,
    },
  });

  const updateOption = (val) => {
    setCurrOptions(val);
    if (val === 'Year') {
      setCurrIndex(yearWise.presentIndex);
      setSeriesData(yearWise.data[yearWise.presentIndex].series);
      setCategories(yearWise.data[yearWise.presentIndex].categories);
      setDisableLeft(yearWise.presentIndex - 1 < 0);
      setDisableRight(yearWise.presentIndex + 1 >= yearWise.labelGroup.length);
      setCurrLebel(yearWise.labelGroup[yearWise.presentIndex]);
      setCurrSubHeader(yearWise.percentageIncrease[yearWise.presentIndex]);
    } else if (val === 'Month') {
      setCurrIndex(monthWise.presentIndex);
      setSeriesData(monthWise.data[monthWise.presentIndex].series);
      setCategories(monthWise.data[monthWise.presentIndex].categories);
      setDisableLeft(monthWise.presentIndex - 1 < 0);
      setCurrLebel(monthWise.labelGroup[monthWise.presentIndex]);
      setDisableRight(monthWise.presentIndex + 1 >= monthWise.labelGroup.length);
      setCurrSubHeader(monthWise.percentageIncrease[monthWise.presentIndex]);
    } else if (val === 'Week') {
      setCurrIndex(weekWise.presentIndex);
      setSeriesData(weekWise.data[weekWise.presentIndex].series);
      setCategories(weekWise.data[weekWise.presentIndex].categories);
      setDisableLeft(weekWise.presentIndex - 1 < 0);
      setCurrLebel(weekWise.labelGroup[weekWise.presentIndex]);
      setDisableRight(weekWise.presentIndex + 1 >= weekWise.labelGroup.length);
      setCurrSubHeader(weekWise.percentageIncrease[weekWise.presentIndex]);
    } else if (val === 'Date') {
      setCurrIndex(dateWise.presentIndex);
      setSeriesData(dateWise.data[dateWise.presentIndex].series);
      setCategories(dateWise.data[dateWise.presentIndex].categories);
      setDisableLeft(dateWise.presentIndex - 1 < 0);
      setCurrLebel(dateWise.labelGroup[dateWise.presentIndex]);
      setDisableRight(dateWise.presentIndex + 1 >= dateWise.labelGroup.length);
      setCurrSubHeader(dateWise.percentageIncrease[dateWise.presentIndex])
    }
  }

  const handleLeftClick = () => {
    if (currOptions === 'Year') {
      if (currIndex - 1 >= 0) {
        setCurrIndex(currIndex - 1);
        setCurrLebel(yearWise.labelGroup[currIndex - 1]);
        setDisableLeft(currIndex - 2 < 0);
        setDisableRight(currIndex >= yearWise.labelGroup.length);
        setSeriesData(yearWise.data[currIndex - 1].series);
        setCategories(yearWise.data[currIndex - 1].categories);
        setCurrSubHeader(yearWise.percentageIncrease[currIndex - 1]);
      }
    } else if (currOptions === 'Month') {
      if (currIndex - 1 >= 0) {
        setCurrIndex(currIndex - 1);
        setCurrLebel(monthWise.labelGroup[currIndex - 1]);
        setDisableLeft(currIndex - 2 < 0);
        setDisableRight(currIndex >= monthWise.labelGroup.length);
        setSeriesData(monthWise.data[currIndex - 1].series);
        setCategories(monthWise.data[currIndex - 1].categories);
        setCurrSubHeader(monthWise.percentageIncrease[currIndex - 1]);
      }
    } else if (currOptions === 'Week') {
      if (currIndex - 1 >= 0) {
        setCurrIndex(currIndex - 1);
        setCurrLebel(weekWise.labelGroup[currIndex - 1]);
        setDisableLeft(currIndex - 2 < 0);
        setDisableRight(currIndex >= weekWise.labelGroup.length);
        setSeriesData(weekWise.data[currIndex - 1].series);
        setCategories(weekWise.data[currIndex - 1].categories);
        setCurrSubHeader(weekWise.percentageIncrease[currIndex - 1]);
      }
    } else if (currOptions === 'Date') {
      if (currIndex - 1 >= 0) {
        setCurrIndex(currIndex - 1);
        setCurrLebel(dateWise.labelGroup[currIndex - 1]);
        setDisableLeft(currIndex - 2 < 0);
        setDisableRight(currIndex >= dateWise.labelGroup.length);
        setSeriesData(dateWise.data[currIndex - 1].series);
        setCategories(dateWise.data[currIndex - 1].categories);
        setCurrSubHeader(dateWise.percentageIncrease[currIndex - 1]);
      }
    }
  }

  const handleRightClick = () => {
    if (currOptions === 'Year') {
      if (currIndex + 1 < yearWise.labelGroup.length) {
        setCurrIndex(currIndex + 1);
        setCurrLebel(yearWise.labelGroup[currIndex + 1]);
        setDisableLeft(currIndex < 0);
        setDisableRight(currIndex + 2 >= yearWise.labelGroup.length);
        setSeriesData(yearWise.data[currIndex + 1].series);
        setCategories(yearWise.data[currIndex + 1].categories);
        setCurrSubHeader(yearWise.percentageIncrease[currIndex + 1]);
      }
    } else if (currOptions === 'Month') {
      if (currIndex + 1 < monthWise.labelGroup.length) {
        setCurrIndex(currIndex + 1);
        setCurrLebel(monthWise.labelGroup[currIndex + 1]);
        setDisableLeft(currIndex < 0);
        setDisableRight(currIndex + 2 >= monthWise.labelGroup.length);
        setSeriesData(monthWise.data[currIndex + 1].series);
        setCategories(monthWise.data[currIndex + 1].categories);
        setCurrSubHeader(monthWise.percentageIncrease[currIndex + 1]);
      }
    } else if (currOptions === 'Week') {
      if (currIndex + 1 < weekWise.labelGroup.length) {
        setCurrIndex(currIndex + 1);
        setCurrLebel(weekWise.labelGroup[currIndex + 1]);
        setDisableLeft(currIndex < 0);
        setDisableRight(currIndex + 2 >= weekWise.labelGroup.length);
        setSeriesData(weekWise.data[currIndex + 1].series);
        setCategories(weekWise.data[currIndex + 1].categories);
        setCurrSubHeader(weekWise.percentageIncrease[currIndex + 1]);
      }
    } else if (currOptions === 'Date') {
      if (currIndex + 1 < dateWise.labelGroup.length) {
        setCurrIndex(currIndex + 1);
        setCurrLebel(dateWise.labelGroup[currIndex + 1]);
        setDisableLeft(currIndex < 0);
        setDisableRight(currIndex + 2 >= dateWise.labelGroup.length);
        setSeriesData(dateWise.data[currIndex + 1].series);
        setCategories(dateWise.data[currIndex + 1].categories);
        setCurrSubHeader(dateWise.percentageIncrease[currIndex + 1]);
      }
    }
  }

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={currSubHeader}
        action={
          <>
            <IconButton aria-label="left" sx={{ mr: 1 }} disabled={disableLeft} onClick={handleLeftClick}>
              <ArrowLeftIcon />
            </IconButton>
            {currLebel}
            <IconButton aria-label="right" sx={{ ml: 1, mr: 1 }} disabled={disableRight} onClick={handleRightClick}>
              <ArrowRightIcon />
            </IconButton>
            <CustomSmallSelect
              value={currOptions}
              onChange={(event) => { updateOption(event.target.value) }}
              sx={{ mt: 1 }}
            >
              {selectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </CustomSmallSelect>
          </>
        }
      />

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <Chart type='line' series={seriesData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
