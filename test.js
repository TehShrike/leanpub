/* eslint-env mocha */
const assert = require('assert');

const nock = require('nock');

const leanpub = require('./');

const SLUG = 'slug';

mockClient();

describe('Client', function () {
  const client = leanpub({
    apiKey: 'apikey',
    bookSlug: 'slug'
  });

  it('should fail without book slug', function () {
    assert.throws(
      function () {
        leanpub();
      },
      Error
    );
  });

  it('should preview in full', function (done) {
    client.previewFull(done);
  });

  it('should publish silently', function (done) {
    client.publish(done);
  });

  it('should publish with release notes', function (done) {
    client.publish({
      releaseNotes: 'release notes'
    },
      done
    );
  });

  it('should get job status', function (done) {
    client.jobStatus(done);
  });

  it('should get book summary', function (done) {
    client.bookSummary(done);
  });

  it('should get latest version', function (done) {
    // XXX: not implemented yet
    client.latestVersion({}, done);
  });

  it('should get sales', function (done) {
    client.sales(done);
  });

  it('should get individual sales', function (done) {
    client.individualSales(done);
  });

  it('should get coupons', function (done) {
    client.coupons(done);
  });

  it('should create coupons', function (done) {
    client.createCoupon({
      couponCode: 'test coupon', // required
      packageDiscounts: [ // required
        {
          discountedPrice: 10,
          packageSlug: 'book'
        }
      ],
      startDate: new Date(), // required
      endDate: new Date(), // required
      maxUses: 1, // required
      note: 'test coupon', // optional
      suspended: false // optional, defaults to false
    }, done);
  });

  it('should update coupons', function (done) {
    client.updateCoupon({
      couponCode: 'test coupon', // required
      suspended: true
    }, done);
  });
});

function mockClient() {
  nock('https://leanpub.com/' + SLUG)
    .get('/')
    .reply(200, {
      'slug': 'thes3cookbook',
      'subtitle': 'Get cooking with Amazon\'s Simple Storage Service',
      'title': 'The S3 Cookbook',
      'about_the_book': 'Amazon’s Simple Storage Service (S3) has been described as “Storage in the cloud”....',
      'last_published_at': '2015-01-15T19:21:50Z',
      'meta_description': null,
      'page_count': 263,
      'page_count_published': 252,
      'total_copies_sold': 111382,
      'total_revenue': '1123334.14',
      'word_count': 43315,
      'word_count_published': 43315,
      'author_string': 'Scott Patten',
      'url': 'http://leanpub.com/thes3cookbook',
      'title_page_url': 'https://s3.amazonaws.com/titlepages.leanpub.com/thes3cookbook/original?1435903728',
      'minimum_price': '3.0',
      'suggested_price': '10.0',
      'image': 'https://s3.amazonaws.com/titlepages.leanpub.com/thes3cookbook/medium?1435903728',
      'possible_reader_count': 0,
      'pdf_preview_url': 'http://leanpub.com/s/redacted-string.pdf',
      'epub_preview_url': 'http://leanpub.com/s/redacted-string.epub',
      'mobi_preview_url': 'http://leanpub.com/s/redacted-string.mobi',
      'pdf_published_url': 'http://leanpub.com/s/another-redacted-string.pdf',
      'epub_published_url': 'http://leanpub.com/s/another-redacted-string.epub',
      'mobi_published_url': 'http://leanpub.com/s/another-redacted-string.mobi'
    })
    .get('/preview.json')
    .reply(200)
    .get('/preview/subset.json')
    .reply(200)
    .post('/publish.json')
    .reply(200)
    .get('./book_status.json')
    .reply(200, {
      'num': 8,
      'job_type': 'GenerateBookJob#preview',
      'total': 28,
      'message': 'Downloading publisher logo...',
      'status': 'working',
      'name': 'Publish scotttest99',
      'time': 1376073552,
      'options': {
        'requested_by': 'scott@leanpub.com',
        'release_notes': 'this is a test\n\nwith two lines',
        'slug': 'scotttest99',
        'action': 'publish',
        'email_readers': true
      }
    })
    .get('/sales.json')
    .reply(200)
    .get('/sales.xml')
    .reply(200)
    .get('/individual_purchases.json')
    .reply(200)
    .get('/individual_purchases.xml')
    .reply(200)
    .get('/coupons.json')
    .reply(200, [
      {
        'coupon_code': 'NOT_A_REAL_COUPON',
        'created_at': '2013-04-17T22:12:58Z',
        'package_discounts': [
          {
            'package_slug': 'book',
            'discounted_price': 2.0
          },
          {
            'package_slug': 'teamedition',
            'discounted_price': 4.0
          }
        ],
        'end_date': '2016-05-17',
        'max_uses': null,
        'note': 'This is not a real coupon',
        'num_uses': 12,
        'start_date': '2013-04-17',
        'suspended': false,
        'updated_at': '2013-04-17T22:12:58Z',
        'book_slug': 'yourbook'
      }
    ])
    .get('/coupons.xml')
    .reply(200)
    .post('/coupons.json')
    .reply(200)
    .put('/coupons.json')
    .reply(200);
}
