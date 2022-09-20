class HomeController {
  async index(req, res) {
    res.send('Books API! - Davi Verçosa');
  }
}

module.exports = new HomeController();
