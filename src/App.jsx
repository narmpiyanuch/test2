import { useState, useEffect } from 'react'
import axios from 'axios';
import Chart from 'react-apexcharts'
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [ageRange, setAgeRange] = useState({});
  const [province, setProvince] = useState({});
  const [chartData, setChartData] = useState({})


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://covid19.ddc.moph.go.th/api/Deaths/round-4-line-list')
        setData(response?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (data && data.data) {
      // set total count
      setCount(data.data.length);

      // set age range count
      const ageRangeData = data.data.reduce((acc, item) => {
        if (item.age_range) {
          acc[item.age_range] = (acc[item.age_range] || 0) + 1;
        }
        return acc;
      }, {})
      setAgeRange(ageRangeData)

      // set province count
      const provinceData = data.data.reduce((acc, item) => {
        if (item.province) {
          acc[item.province] = (acc[item.province] || 0) + 1;
        }
        return acc
      }, {})
      setProvince(provinceData)
    }
  }, [data])

  useEffect(() => {
    if (province && Object.keys(province).length > 0) {
      const provinceNames = Object.keys(province);
      const provinceCounts = Object.values(province);

      const chartOptions = {
        chart: {
          id: 'province-chart',
        },
        labels: provinceNames,
        dataLabels: {
          enabled: true,
        },
        title: {
          text: 'จำนวนผู้ป่วยยืนยันตามจังหวัด',
          align: 'center',
        },
      };

      setChartData({
        options: chartOptions,
        series: provinceCounts,
      });
    }
  }, [province]);


  return (
    <div>
      <h2>Covid round 4 summary</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px', border: '1px solid gray', borderRadius: '6px', padding: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Total of deaths</div>
        <div style={{ marginTop: '10px' }}>{count}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px', gap: '40px' }}>
        <div style={{ width: '200px' }}>
          <table>
            <thead>
              <tr>
                <th>Age Range</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ageRange).map(([ageRange, count]) => (
                <tr key={ageRange}>
                  <td>{ageRange}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ width: '600px' }}>
          {chartData?.options && chartData?.series && (
            <Chart options={chartData.options} series={chartData.series} type='pie' />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
