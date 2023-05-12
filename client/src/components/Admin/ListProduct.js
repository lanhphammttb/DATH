import React, { useState, useEffect } from 'react';
import axios from 'axios';
const ListProduct = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:8000/api/sanpham')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
    return(
      <>    
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
          <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td><img src={item.Image} alt ="Ảnh"/></td>
              <td>{item.TenSP}</td>
            </tr>
          ))}
          </tbody>
        </table>     
      </>
    )
}

export default ListProduct;