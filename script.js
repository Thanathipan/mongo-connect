const form = document.querySelector('.device-form');
const tableBody = document.querySelector('tbody');
const API_URL = 'http://localhost:3000/API/admin';
const fetchDevices = async () => {
  try {
    const response = await fetch(API_URL);
    const devices = await response.json();
    tableBody.innerHTML = '';
    devices.forEach((device) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${device.device_name}</td>
        <td>${device.brand}</td>
        <td>${device.model}</td>
        <td>${device.price}</td>
        <td>${device.color}</td>
        <td>${device.storage}</td>
        <td>${device.release_date}</td>
        <td class="btn"><button data-id="${device._id}" class="edit-btn">Edit</button><button data-id="${device._id}" class="delete-btn">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
  }
};
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll('input');
  const deviceData = {
    device_name: inputs[0].value,
    brand: inputs[1].value,
    model: inputs[2].value,
    price: inputs[3].value,
    color: inputs[4].value,
    storage: inputs[5].value,
    release_date: inputs[6].value,
  };
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deviceData),
    });
    if (response.ok) {
      alert('Device added successfully!');
      form.reset();
      fetchDevices();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error adding device:', error);
  }
});
tableBody.addEventListener('click', async (event) => {
  const deviceId = event.target.getAttribute('data-id');
  if (event.target.classList.contains('delete-btn')) {
    const confirmDelete = confirm('Are you sure you want to delete this device?');
    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/${deviceId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Device deleted successfully!');
          fetchDevices();
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  }
  if (event.target.classList.contains('edit-btn')) {
    try {
      const response = await fetch(`${API_URL}/${deviceId}`);
      const device = await response.json();
      const inputs = form.querySelectorAll('input');
      inputs[0].value = device.device_name;
      inputs[1].value = device.brand;
      inputs[2].value = device.model;
      inputs[3].value = device.price;
      inputs[4].value = device.color;
      inputs[5].value = device.storage;
      inputs[6].value = device.release_date;
      form.onsubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedDeviceData = {};
        formData.forEach((value, key) => {
          updatedDeviceData[key] = value;
        });
        try {
          const updateResponse = await fetch(`${API_URL}/${deviceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDeviceData),
          });
          if (updateResponse.ok) {
            alert('Device updated successfully!');
            form.reset();
            fetchDevices();
            form.onsubmit = null;
          } else {
            const errorData = await updateResponse.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error updating device:', error);
        }
      };
    } catch (error) {
      console.error('Error fetching device for editing:', error);
    }
  }
});
fetchDevices();