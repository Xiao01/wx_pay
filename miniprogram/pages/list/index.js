// 购买商品
const regeneratorRuntime = require("../../lib/runtime");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getGoodsList();
  },

  async getGoodsList() {
    // 利用云开发新接口，读取所有商品数据
    const db = wx.cloud.database();
    const result = await db.collection('goods').get();
    let data = result.data || [];
    this.setData({
      goods: data
    });
  },
  //发起订单
  async makeOrder(e) {
    wx.showLoading({
      title: '正在下单',
    });

    // 利用云开发新接口，调用云函数发起订单
    let id = e.target.dataset.goodid;
    const { result } = await wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'unifiedorder',
        data: {
          goodId: id
        }
      }
    });

    const data = result.data;

    wx.hideLoading();

    wx.navigateTo({
      url: '/pages/result/index?id=${data.out_trade_no}'
    });
  }
})