import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/app.js';

chai.should();
chai.use(chaiHttp);

let userId;
let token;

describe('Users API', () => {

	before((done) => {
		let user = {
			name: "Abbey",
			email: "abiodun@gmail.com",
			password: "0123456789"
		}
		chai.request(server)
			.post('/api/v0/users')
			.send(user)
			.end((err, res) => {
				userId = res.body.id;
				token = res.body.token;
				done();
			});
	});

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

	describe('POST /api/v0/users', () => {
		it('It should POST a new user', (done) => {
			let user = {
				name: "Abiodun Shittu",
				email: "jerrywizklay1@gmail.com",
				password: "1234567890"
			}
			chai.request(server)
				.post('/api/v0/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('statusCode');
					res.body.should.have.property('data');
					res.body.should.have.property('token');
					done();
				});
		});

		it('It should NOT POST a new user without the name property', (done) => {
			let user = {
				email: "jerrywizklay1@gmail.com",
				password: "1234567890"
			}
			chai.request(server)
				.post('/api/v0/users')
				.send(user)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eq('Unprocessable data')
					done();
				});
		});

	});

	describe('GET /api/v0/users/:id', () => {
		it('It should GET a specific user by ID', (done) => {
			chai.request(server)
				.get(`/api/v0/users/${userId}`)
				.set({ Authorization: 'bearer ' + token })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('statusCode');
					res.body.should.have.property('data');
					done();
				});
		});

		it('It should NOT GET a specific user With the wrong ID', (done) => {
			chai.request(server)
				.get(`/api/v0/users/1`)
				.set({ Authorization: 'bearer ' + token })
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('message').eq('Unable to retrieve user')
					done();
				});
		});

	});

	// describe('PATCH /api/v0/users/:id', () => {
		// it('It should PATCH an existing user by ID', (done) => {
		// 	chai.request(server)
		// 		.patch(`/api/v0/users/${userId}`)
		// 		.set({ Authorization: 'bearer ' + token })
		// 		.send({
		// 			name: "Abiodun Gafar Shittu"
		// 		})
		// 		.end((err, res) => {
		// 			res.should.have.status(200);
		// 			res.body.should.be.a('object');
		// 			res.body.should.have.property('data');
		// 			// res.body.should.have.property('name').eq('Abiodun Gafar Shittu');
		// 			done();
		// 		});
		// });

	// 	it("It should NOT PATCH an existing user with invalid ID", (done) => {
	// 		chai.request(server)
	// 			.patch(`/api/v0/users/234`)
	// 			.set({ Authorization: 'bearer ' + token })
	// 			.end((err, res) => {
	// 				res.should.have.status(404);
	// 				res.body.should.have.property('message').eq('Unable to retrieve user')
	// 				done();
	// 			});
	// 	});
	// });

	// 	describe('DELETE /api/v0/users/:id', () => {
	// 		it('It should DELETE an existing user with ID', (done) => {
	// 			chai.request(server)                
	// 				.delete(`/api/v0/users/${userId}`)
	// 				.end((err, res) => {
	// 					res.should.have.status(403);
	// 				done();
	// 				});
	// 		});

	// 		it('It should NOT DELETE a user that hasn\'t been created', (done) => {
	// 			chai.request(server)                
	// 				.delete(`/api/v0/users/1`)
	// 				.end((err, res) => {
	// 					res.should.have.status(403);
	// 					res.text.should.be.eq('The User with this ID does not exist');
	// 				done();
	// 				});
	// 		});

	// 	});
});