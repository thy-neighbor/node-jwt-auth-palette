'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');


const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { TEST_DATABASE_URL } = require('../config');
const {Palette} = require('../palette/models');


const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Palette Public Endpoints', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  const testRGB=[[203, 44, 18],[247, 187, 54],[231, 226, 154],[79, 166, 120],[110, 143, 84]];
  const testTitle="testjkdfjkdf";

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('/api/public', function () {
    it('Should POST a specified users palette', function () {
      return chai
        .request(app)
        .post('/api/public')    //this is where you left off
        .send({
            user:username,
            rgb:testRGB,
            name:testTitle
        })
        .then((res) =>{
          expect(res).to.has.status(201);
          return Palette.findOne({name:testTitle})
        }).then(palette => {
            expect(palette).to.not.be.null;
            expect(palette.user).to.equal(username);
            expect(JSON.stringify(palette.rgb)).to.equal(JSON.stringify(testRGB));
            return palette
        }).then(()=>{
            return Palette.remove({user:username});
        })
    });

    it('Should GET a specified users palette', function () {
        return chai
        .request(app)
        .post('/api/public')    
        .send({
            user:username,
            rgb:testRGB,
            name:testTitle
        })
        .then(res =>{
          expect(res).to.have.status(201);
          return Palette.findOne({name:testTitle})
        }).then(palette => {
            return chai
            .request(app)
            .get('/api/public?q='+ username)
            .set('cache-control','no-cache')
            .send({user:username})
            .then(res =>{
              expect(res).to.have.status(200);
              expect(res.body).to.not.be.empty;
              expect(JSON.stringify(res.body.data[0].rgb)).to.equal(JSON.stringify(palette.rgb));
            });
        })

    });

  it('Should UPDATE a specified users palette', function (done) {

    this.timeout(5000);
    setTimeout(async()=>{
      let pal=await Palette.findOne({user:username});
      let newTestRgb=[[0, 0, 0],[247, 187, 54],[231, 226, 154],[79, 166, 120],[110, 143, 84]];
      console.log('palette found is: ', pal);

      chai
      .request(app)
      .put('/api/public')    //this is where you left off
      .set('content-type','application/json')
      .send({
        paletteId:pal._id,
        paletteRgb:newTestRgb})
      .then(async(res) =>{
        console.log('HEREEEEEEEEE');
        expect(res).to.have.status(201);
        let p =await Palette.findOne({_id:pal._id});
        return p
        }).then((palette)=>{
          expect(palette.rgb).to.not.equal(testRGB);
          expect(palette.user).to.be.equal(username);
          expect(palette.name).to.be.equal(testTitle);
          done()
        });

    }
      
    , 0);

  })//it

  //THIS IS IMPORTANT!!! THE TRICK TO BEATING MOCHA CHAI ASYNC TESTING BUGS
  it('Should DELETE a specified users palette', function (done) {

    //this.timeout(5000);
    setTimeout(async()=>{
      let pal=await Palette.findOne({user:username});
      console.log('palette id: ', pal);

      chai
      .request(app)
      .delete('/api/public')    //this is where you left off
      .set('content-type','application/json')
      .send({paletteId:pal._id})
      .then(res =>{
        expect(res).to.have.status(201);
        
        done();
        }) 
      }
      
    , 0);

    })//it
  })
});//describe


