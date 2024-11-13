package com.example.restaurante.dto;

import java.util.List;

public class PedidoDTO {
    private String nomeCliente;
    private String endereco;
    private String descricao;
    private List<ItemDTO> itens;
    

    // Construtores
    public PedidoDTO() {}

    public PedidoDTO(String nomeCliente, String endereco, String descricao, List<ItemDTO> itens) {
        this.nomeCliente = nomeCliente;
        this.endereco = endereco;
        this.descricao = descricao;
        this.itens = itens;
    }

    // Getters e Setters
    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public List<ItemDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemDTO> itens) {
        this.itens = itens;
    }
}