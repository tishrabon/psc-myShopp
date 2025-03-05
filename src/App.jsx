import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './compos';
import { Home, Login, Register, Reset, OrderHistory, Cart, User, UpdateUser, AdminPanel, ProjectDocument } from './pages'; 
import ProductPage from './compos/products/ProductPage';
import 'react-toastify/dist/ReactToastify.css';
import ScrollTop from './ScrollTop';

function App() {

  return (
    <div className="flex flex-col justify-start items-center w-full max-w-[100vw">
      <div className="flex flex-col justify-start items-center font-myfont w-full">
        <Header />

        <main className="w-full min-w-[320px] max-w-[1300px] min-h-[100vh] flex flex-col justify-start items-center font-myfont z-[1] px-5">        
          <ScrollTop />

          <Routes>          
            <Route path="/" element={<Home />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/cart" element={<Cart />} />        
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/updateuser" element={<UpdateUser />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/adminpanel" element={<AdminPanel />}/>
            <Route path="/projectdoc" element={<ProjectDocument />} />
          </Routes>

        </main>

        <Footer />
      </div>      
    </div>
  )
}

export default App
