import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

console.clear();

const Title = ({count}) => {
  return (
    <div>
       <div>
          <h1>Counting: - ({count})</h1>
       </div>
    </div>
  );
}

const DataForm = ({addData}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addData(input.value);
        input.value = '';
      }}>
      <input className="form-control col-md-12" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

const Datas = ({data, remove}) => {
  // Each data
  return (<a href="#" className="list-group-item" onClick={() => {remove(data.id)}}>{data.text}</a>);
}

const DataList = ({datas, remove}) => {
  // Map through the datas
  const DataNode = datas.map((data) => {
    return (<Datas data={data} key={data.id} remove={remove}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{DataNode}</div>);
}

// Contaner Component
// Data Id
window.id = 0;
class App extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos'
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }
  // Add data handler
  addData(val){
    // Assemble data
    const data = {text: val}
    // Update data
    axios.post(this.apiUrl, data)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all datas except the one to be removed
    const remainder = this.state.data.filter((data) => {
      if(data.id !== id) return data;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }

  render(){
    // Render JSX
    return (
      <div>
        <Title count={this.state.data.length}/>
        <DataForm addData={this.addData.bind(this)}/>
        <DataList
          datas={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}
render(<App />, document.getElementById('container'));
