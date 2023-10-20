import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <Container >             

    <div class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h6>About</h6>
            <p class="text-justify">Welcome to "Bird Cage Shop" - where we create a cozy haven for pet and aviary enthusiasts. At our store, we offer a range of high-quality products, from beautiful bird cages and premium bird food to unique accessories and bird care services. We are committed to providing you and your feathered friends with an enjoyable shopping experience and dedicated care. Explore our shop and find the finest products to make a warm and inviting environment for your beloved avian companions.</p>
          </div>

          <div class="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul class="footer-links">
              <li><a href="http://scanfcode.com/category/c-language/">Shop by Bird Type</a></li>
              <li><a href="http://scanfcode.com/category/front-end-development/">Shop by Cage Size</a></li>
              <li><a href="http://scanfcode.com/category/back-end-development/">Bird Cage Accessories</a></li>
              <li><a href="http://scanfcode.com/category/java-programming-language/">Cage Material</a></li>
              <li><a href="http://scanfcode.com/category/android/">Cage Style</a></li>
              <li><a href="http://scanfcode.com/category/templates/">Bird Food and Treats</a></li>
              <li><a href="http://scanfcode.com/category/templates/">Maintenance</a></li>
            </ul>
          </div>

          <div class="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <li><a href="http://scanfcode.com/about/">About Us</a></li>
              <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
              <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
              <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
              <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
            </ul>
          </div>
        </div>

      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-12">
            <p class="copyright-text">Copyright &copy; 2023 All Rights Reserved by 
         <a href="#">BirdCageShop</a>.
            </p>
          </div>

        </div>
      </div>
      </div>
      
           </Container>
        </footer>
    );
};
export default Footer;