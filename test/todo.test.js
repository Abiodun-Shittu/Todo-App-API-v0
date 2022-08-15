import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

chai.should();
chai.use(chaiHttp);

describe('TODOs API', () => {

    describe('GET /api/v0/todos', () => {
        it('It should GET all the todos', (done) => {
            chai.request(server)
                .get('/api/v0/todos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(0);
                    done();
                });
        });

        it('It should NOT GET all the todos', (done) => {
            chai.request(server)
                .get('/api/v0/wrongURL')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });
});