import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

// Assertion style
chai.should();
chai.use(chaiHttp);

let userId;

describe('Users API', () => {

    before((done) => {
        chai.request(server)
        .post('/api/v0/users')
        .send({
            name: "Abbey",
            email: "abiodun@gmail.com"
        })
        .end((err, res) => {
            userId = res.body.id
        done();
        })
    })

    // GET Route Test
    describe('GET /api/v0/users', () => {
        it('It should GET all the users', (done) => {
            chai.request(server)
                .get('/api/v0/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                done();
                });
        });
        
        it('It should NOT GET all the users', (done) => {
            chai.request(server)
                .get('/api/v0/wrongURL')
                .end((err, res) => {
                    res.should.have.status(404);
                done();
                });
        });
        
    });

    // GET (by id) Route Test
    describe('GET /api/v0/users/:id', () => {
        it('It should GET a specific user by ID', (done) => {
            chai.request(server)
                .get(`/api/v0/users/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    done();
                });
        });

        it('It should NOT GET a specific user With the wrong ID', (done) => {
            chai.request(server)
                .get(`/api/v0/users/1`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq('The User with this ID does not exist');
                done();
                });
        });
        
    });
    
    // POST Route Test
 describe('POST /api/v0/users', () => {
        it('It should POST a new user', (done) => {
            chai.request(server)
                .post('/api/v0/users')
                .send({
                    name: "Abiodun Shittu",
                    email: "jerrywizklay1@gmail.com"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    done();
                });
        });

        it('It should NOT POST a new user without the name property', (done) => {
            chai.request(server)
                .post('/api/v0/users')
                .send({
                    email: "jerrywizklay1@gmail.com"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eq('A name should be provided');
                    done();
                });
        });
        
    });

    // PATCH Route Test

    describe('PATCH /api/v0/users/:id', () => {
        it('It should PATCH an existing user by ID', (done) => {
            chai.request(server)                
                .patch(`/api/v0/users/${userId}`)
                .send({
                    name: "Abiodun Gafar Shittu"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('name').eq('Abiodun Gafar Shittu');
                done();
                });
        });

        it("It should NOT PATCH an existing user with invalid ID", (done) => {
            chai.request(server)                
                .patch(`/api/v0/users/1`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq('The User with this ID does not exist');
                done();
                });
        });        
    });

    // DELETE Route Test

    describe('DELETE /api/v0/users/:id', () => {
        it('It should DELETE an existing user with ID', (done) => {
            chai.request(server)                
                .delete(`/api/v0/users/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                done();
                });
        });

        it('It should NOT DELETE a user that hasn\'t been created', (done) => {
            chai.request(server)                
                .delete(`/api/v0/users/1`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq('The User with this ID does not exist');
                done();
                });
        });

    });
});