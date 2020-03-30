const FileVerify = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(FileVerify);
};
