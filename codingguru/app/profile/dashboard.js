import Profile from './profile';

function Dashboard() {
  const username = 'Alex'; 

return (
    <div>
       <Profile username={username} /> 
    </div>
  );
}

export default Dashboard;