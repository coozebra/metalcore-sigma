/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface SaleInterface extends utils.Interface {
  functions: {
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "OPERATOR_ROLE()": FunctionFragment;
    "addOperator(address)": FunctionFragment;
    "asset()": FunctionFragment;
    "endSale()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "increaseMaxMintable(uint256)": FunctionFragment;
    "isOperator(address)": FunctionFragment;
    "maxMintPerAddress()": FunctionFragment;
    "maxMintPerTx()": FunctionFragment;
    "maxMintable()": FunctionFragment;
    "mintUnsoldTokens(address)": FunctionFragment;
    "minted(address)": FunctionFragment;
    "mintedPresale(address)": FunctionFragment;
    "mintingCap()": FunctionFragment;
    "nonces(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "price()": FunctionFragment;
    "purchase(uint256,bytes)": FunctionFragment;
    "removeOperator(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setMaxMintPerAddress(uint256)": FunctionFragment;
    "setMaxMintPerTx(uint256)": FunctionFragment;
    "setPrice(uint256)": FunctionFragment;
    "setSigner(address)": FunctionFragment;
    "signer()": FunctionFragment;
    "startPresale()": FunctionFragment;
    "startSale()": FunctionFragment;
    "step()": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "totalMinted()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdrawEth(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "OPERATOR_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "addOperator", values: [string]): string;
  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(functionFragment: "endSale", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseMaxMintable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "isOperator", values: [string]): string;
  encodeFunctionData(
    functionFragment: "maxMintPerAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxMintPerTx",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxMintable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintUnsoldTokens",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "minted", values: [string]): string;
  encodeFunctionData(
    functionFragment: "mintedPresale",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "mintingCap",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "nonces", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "price", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "purchase",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxMintPerAddress",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxMintPerTx",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setSigner", values: [string]): string;
  encodeFunctionData(functionFragment: "signer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "startPresale",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "startSale", values?: undefined): string;
  encodeFunctionData(functionFragment: "step", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalMinted",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "withdrawEth", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "OPERATOR_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endSale", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "increaseMaxMintable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isOperator", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxMintPerAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxMintPerTx",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxMintable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintUnsoldTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "minted", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mintedPresale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintingCap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "price", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "purchase", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMaxMintPerAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxMintPerTx",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setSigner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "signer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "startPresale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "startSale", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "step", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalMinted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawEth",
    data: BytesLike
  ): Result;

  events: {
    "LogAssetSet(address)": EventFragment;
    "LogEthSent(address,uint256)": EventFragment;
    "LogMaxMintPerAddressSet(uint256)": EventFragment;
    "LogMaxMintPerTxSet(uint256)": EventFragment;
    "LogMaxMintableSet(uint256)": EventFragment;
    "LogMintingCapSet(uint256)": EventFragment;
    "LogOperatorAdded(address)": EventFragment;
    "LogOperatorRemoved(address)": EventFragment;
    "LogPresaleStarted(address)": EventFragment;
    "LogPriceSet(uint256)": EventFragment;
    "LogPurchased(address,uint256)": EventFragment;
    "LogSaleEnded(address)": EventFragment;
    "LogSaleStarted(address)": EventFragment;
    "LogSignerSet(address)": EventFragment;
    "LogUnsoldTokensMinted(address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LogAssetSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogEthSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogMaxMintPerAddressSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogMaxMintPerTxSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogMaxMintableSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogMintingCapSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogOperatorAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogOperatorRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogPresaleStarted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogPriceSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogPurchased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogSaleEnded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogSaleStarted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogSignerSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LogUnsoldTokensMinted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
}

export type LogAssetSetEvent = TypedEvent<[string], { asset: string }>;

export type LogAssetSetEventFilter = TypedEventFilter<LogAssetSetEvent>;

export type LogEthSentEvent = TypedEvent<
  [string, BigNumber],
  { account: string; amount: BigNumber }
>;

export type LogEthSentEventFilter = TypedEventFilter<LogEthSentEvent>;

export type LogMaxMintPerAddressSetEvent = TypedEvent<
  [BigNumber],
  { maxMintPerAddress: BigNumber }
>;

export type LogMaxMintPerAddressSetEventFilter =
  TypedEventFilter<LogMaxMintPerAddressSetEvent>;

export type LogMaxMintPerTxSetEvent = TypedEvent<
  [BigNumber],
  { maxMintPerTx: BigNumber }
>;

export type LogMaxMintPerTxSetEventFilter =
  TypedEventFilter<LogMaxMintPerTxSetEvent>;

export type LogMaxMintableSetEvent = TypedEvent<
  [BigNumber],
  { maxMintable: BigNumber }
>;

export type LogMaxMintableSetEventFilter =
  TypedEventFilter<LogMaxMintableSetEvent>;

export type LogMintingCapSetEvent = TypedEvent<
  [BigNumber],
  { mintingCap: BigNumber }
>;

export type LogMintingCapSetEventFilter =
  TypedEventFilter<LogMintingCapSetEvent>;

export type LogOperatorAddedEvent = TypedEvent<[string], { account: string }>;

export type LogOperatorAddedEventFilter =
  TypedEventFilter<LogOperatorAddedEvent>;

export type LogOperatorRemovedEvent = TypedEvent<[string], { account: string }>;

export type LogOperatorRemovedEventFilter =
  TypedEventFilter<LogOperatorRemovedEvent>;

export type LogPresaleStartedEvent = TypedEvent<[string], { operator: string }>;

export type LogPresaleStartedEventFilter =
  TypedEventFilter<LogPresaleStartedEvent>;

export type LogPriceSetEvent = TypedEvent<[BigNumber], { price: BigNumber }>;

export type LogPriceSetEventFilter = TypedEventFilter<LogPriceSetEvent>;

export type LogPurchasedEvent = TypedEvent<
  [string, BigNumber],
  { account: string; amount: BigNumber }
>;

export type LogPurchasedEventFilter = TypedEventFilter<LogPurchasedEvent>;

export type LogSaleEndedEvent = TypedEvent<[string], { operator: string }>;

export type LogSaleEndedEventFilter = TypedEventFilter<LogSaleEndedEvent>;

export type LogSaleStartedEvent = TypedEvent<[string], { operator: string }>;

export type LogSaleStartedEventFilter = TypedEventFilter<LogSaleStartedEvent>;

export type LogSignerSetEvent = TypedEvent<[string], { signer: string }>;

export type LogSignerSetEventFilter = TypedEventFilter<LogSignerSetEvent>;

export type LogUnsoldTokensMintedEvent = TypedEvent<
  [string, BigNumber],
  { account: string; amount: BigNumber }
>;

export type LogUnsoldTokensMintedEventFilter =
  TypedEventFilter<LogUnsoldTokensMintedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  { role: string; previousAdminRole: string; newAdminRole: string }
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  { role: string; account: string; sender: string }
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  { role: string; account: string; sender: string }
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

export interface Sale extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SaleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<[string]>;

    addOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    asset(overrides?: CallOverrides): Promise<[string]>;

    endSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    increaseMaxMintable(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isOperator(_account: string, overrides?: CallOverrides): Promise<[boolean]>;

    maxMintPerAddress(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxMintPerTx(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxMintable(overrides?: CallOverrides): Promise<[BigNumber]>;

    mintUnsoldTokens(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    minted(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    mintedPresale(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    mintingCap(overrides?: CallOverrides): Promise<[BigNumber]>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    price(overrides?: CallOverrides): Promise<[BigNumber]>;

    purchase(
      _amount: BigNumberish,
      _sig: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxMintPerAddress(
      _maxMintPerAddress: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxMintPerTx(
      _maxMintPerTx: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPrice(
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    signer(overrides?: CallOverrides): Promise<[string]>;

    startPresale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    step(overrides?: CallOverrides): Promise<[number]>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    totalMinted(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawEth(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

  addOperator(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  asset(overrides?: CallOverrides): Promise<string>;

  endSale(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  increaseMaxMintable(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isOperator(_account: string, overrides?: CallOverrides): Promise<boolean>;

  maxMintPerAddress(overrides?: CallOverrides): Promise<BigNumber>;

  maxMintPerTx(overrides?: CallOverrides): Promise<BigNumber>;

  maxMintable(overrides?: CallOverrides): Promise<BigNumber>;

  mintUnsoldTokens(
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  minted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  mintedPresale(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  mintingCap(overrides?: CallOverrides): Promise<BigNumber>;

  nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  price(overrides?: CallOverrides): Promise<BigNumber>;

  purchase(
    _amount: BigNumberish,
    _sig: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeOperator(
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxMintPerAddress(
    _maxMintPerAddress: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxMintPerTx(
    _maxMintPerTx: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPrice(
    _price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSigner(
    _signer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startPresale(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startSale(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  step(overrides?: CallOverrides): Promise<number>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  totalMinted(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    _newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawEth(
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

    addOperator(_account: string, overrides?: CallOverrides): Promise<void>;

    asset(overrides?: CallOverrides): Promise<string>;

    endSale(overrides?: CallOverrides): Promise<void>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    increaseMaxMintable(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    isOperator(_account: string, overrides?: CallOverrides): Promise<boolean>;

    maxMintPerAddress(overrides?: CallOverrides): Promise<BigNumber>;

    maxMintPerTx(overrides?: CallOverrides): Promise<BigNumber>;

    maxMintable(overrides?: CallOverrides): Promise<BigNumber>;

    mintUnsoldTokens(_to: string, overrides?: CallOverrides): Promise<void>;

    minted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    mintedPresale(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    mintingCap(overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    price(overrides?: CallOverrides): Promise<BigNumber>;

    purchase(
      _amount: BigNumberish,
      _sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    removeOperator(_account: string, overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxMintPerAddress(
      _maxMintPerAddress: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxMintPerTx(
      _maxMintPerTx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPrice(_price: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setSigner(_signer: string, overrides?: CallOverrides): Promise<void>;

    signer(overrides?: CallOverrides): Promise<string>;

    startPresale(overrides?: CallOverrides): Promise<void>;

    startSale(overrides?: CallOverrides): Promise<void>;

    step(overrides?: CallOverrides): Promise<number>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalMinted(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      _newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawEth(_to: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "LogAssetSet(address)"(asset?: string | null): LogAssetSetEventFilter;
    LogAssetSet(asset?: string | null): LogAssetSetEventFilter;

    "LogEthSent(address,uint256)"(
      account?: string | null,
      amount?: null
    ): LogEthSentEventFilter;
    LogEthSent(account?: string | null, amount?: null): LogEthSentEventFilter;

    "LogMaxMintPerAddressSet(uint256)"(
      maxMintPerAddress?: null
    ): LogMaxMintPerAddressSetEventFilter;
    LogMaxMintPerAddressSet(
      maxMintPerAddress?: null
    ): LogMaxMintPerAddressSetEventFilter;

    "LogMaxMintPerTxSet(uint256)"(
      maxMintPerTx?: null
    ): LogMaxMintPerTxSetEventFilter;
    LogMaxMintPerTxSet(maxMintPerTx?: null): LogMaxMintPerTxSetEventFilter;

    "LogMaxMintableSet(uint256)"(
      maxMintable?: null
    ): LogMaxMintableSetEventFilter;
    LogMaxMintableSet(maxMintable?: null): LogMaxMintableSetEventFilter;

    "LogMintingCapSet(uint256)"(mintingCap?: null): LogMintingCapSetEventFilter;
    LogMintingCapSet(mintingCap?: null): LogMintingCapSetEventFilter;

    "LogOperatorAdded(address)"(
      account?: string | null
    ): LogOperatorAddedEventFilter;
    LogOperatorAdded(account?: string | null): LogOperatorAddedEventFilter;

    "LogOperatorRemoved(address)"(
      account?: string | null
    ): LogOperatorRemovedEventFilter;
    LogOperatorRemoved(account?: string | null): LogOperatorRemovedEventFilter;

    "LogPresaleStarted(address)"(
      operator?: string | null
    ): LogPresaleStartedEventFilter;
    LogPresaleStarted(operator?: string | null): LogPresaleStartedEventFilter;

    "LogPriceSet(uint256)"(price?: null): LogPriceSetEventFilter;
    LogPriceSet(price?: null): LogPriceSetEventFilter;

    "LogPurchased(address,uint256)"(
      account?: string | null,
      amount?: null
    ): LogPurchasedEventFilter;
    LogPurchased(
      account?: string | null,
      amount?: null
    ): LogPurchasedEventFilter;

    "LogSaleEnded(address)"(operator?: string | null): LogSaleEndedEventFilter;
    LogSaleEnded(operator?: string | null): LogSaleEndedEventFilter;

    "LogSaleStarted(address)"(
      operator?: string | null
    ): LogSaleStartedEventFilter;
    LogSaleStarted(operator?: string | null): LogSaleStartedEventFilter;

    "LogSignerSet(address)"(signer?: null): LogSignerSetEventFilter;
    LogSignerSet(signer?: null): LogSignerSetEventFilter;

    "LogUnsoldTokensMinted(address,uint256)"(
      account?: string | null,
      amount?: null
    ): LogUnsoldTokensMintedEventFilter;
    LogUnsoldTokensMinted(
      account?: string | null,
      amount?: null
    ): LogUnsoldTokensMintedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): RoleRevokedEventFilter;
  };

  estimateGas: {
    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    addOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    asset(overrides?: CallOverrides): Promise<BigNumber>;

    endSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    increaseMaxMintable(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isOperator(_account: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxMintPerAddress(overrides?: CallOverrides): Promise<BigNumber>;

    maxMintPerTx(overrides?: CallOverrides): Promise<BigNumber>;

    maxMintable(overrides?: CallOverrides): Promise<BigNumber>;

    mintUnsoldTokens(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    minted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    mintedPresale(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    mintingCap(overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    price(overrides?: CallOverrides): Promise<BigNumber>;

    purchase(
      _amount: BigNumberish,
      _sig: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxMintPerAddress(
      _maxMintPerAddress: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxMintPerTx(
      _maxMintPerTx: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPrice(
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    signer(overrides?: CallOverrides): Promise<BigNumber>;

    startPresale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    step(overrides?: CallOverrides): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalMinted(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawEth(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    asset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    endSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    increaseMaxMintable(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isOperator(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxMintPerAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxMintPerTx(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxMintable(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mintUnsoldTokens(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    minted(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintedPresale(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintingCap(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nonces(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    price(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    purchase(
      _amount: BigNumberish,
      _sig: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeOperator(
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxMintPerAddress(
      _maxMintPerAddress: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxMintPerTx(
      _maxMintPerTx: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPrice(
      _price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSigner(
      _signer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    startPresale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startSale(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    step(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalMinted(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawEth(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
