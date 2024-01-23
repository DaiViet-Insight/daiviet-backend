'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Post.belongsTo(models.User, {
            foreignKey: 'postedBy'
        });
    }
  }
  Post.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(128),
      unique: true
    },
    content: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    postedBy: {
      type: DataTypes.UUID
    }
  }, {
    sequelize,
    modelName: 'Post',
    timestamps: false,
  });

  // initizlize Post data
  Post.initData = async function() {
    await this.bulkCreate([
      { 
        id: '59928e6b-d2c8-4620-b699-028ca0811afe',
        title: 'Cách mạng tháng 8 năm 1945 mang lại độc lập cho Việt Nam',
        content: 'Thứ nhất, Cách mạng Tháng Tám đã nêu cao tinh thần quật khởi của dân tộc Việt Nam, khi mà chúng ta phải đối diện với thực dân Pháp - một trong số các quốc gia tư bản chủ nghĩa phát triển bậc nhất vào thế kỷ XIX, XX; phải đương đầu với chủ nghĩa phát-xít và lực lượng đồng minh, những thế lực đang chi phối đời sống chính trị quốc tế lúc đó. Lần đầu tiên một dân tộc đã tự lực tự cường, đứng lên làm cách mạng để giành lấy những quyền dân tộc cơ bản nhất của mình, mà không phải do ai ban cho, từ trong tay hệ thống thuộc địa lâu đời của chủ nghĩa thực dân Pháp. Chủ tịch Hồ Chí Minh và Đảng ta đã thành công khi khơi dậy được nguồn lực mạnh mẽ nhất của dân tộc - chủ nghĩa yêu nước - nhân văn Việt Nam và lợi ích của các giai tầng, của mỗi con người là thống nhất với lợi ích dân tộc. Để từ đó tập hợp hết thảy các lực lượng yêu nước, đoàn kết toàn thể nhân dân Việt Nam tạo thành một lực lượng cách mạng vô cùng to lớn làm nên thắng lợi của Cách mạng Tháng Tám, thiết lập nên nước Việt Nam Dân chủ Cộng hòa với tiêu chí Độc lập - Tự do - Hạnh phúc.',
        postedBy: '867940fd-37f4-4120-b20a-ed64a39c9434'
      }
    ]);
  }

  return Post;
};